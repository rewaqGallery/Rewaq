const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const { getAll, getOne, deleteOne } = require("./handlersFactory");

module.exports.createOrder = asyncHandler(async (req, res, next) => {
  // console.log("isReplicaSet:", mongoose.connection.client.s.options.replicaSet);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    let {
      detailedAddress,
      phone,
      city,
      postalCode,
      governorate,
      shippingPrice = 0,
      paymentMethod = "cash",
      idempotencyKey,
    } = req.body;

    //0- CHECK IDEMPOTENCY
    const existingOrder = await orderModel
      .findOne({ user: userId, idempotencyKey })
      .session(session);

    if (existingOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        status: "success",
        message: "Order already created",
        data: existingOrder,
      });
    }

    //1- GET CART
    let cart = await cartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.cartItems.length === 0) {
      throw new apiError("Cart is empty", 400);
    }

    //2- CHECK STOCK
    for (const item of cart.cartItems) {
      const product = await productModel
        .findById(item.product)
        .session(session);
      if (!product) {
        throw new apiError(`No product for this id`, 400);
      }
    }

    //3- SNAPSHOT ORDER ITEMS
    const orderItems = cart.cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    //4- CREATE ORDER
    const order = new orderModel({
      orderItems,
      user: userId,
      shippingAddress: {
        detailedAddress,
        phone,
        city,
        governorate,
        postalCode,
      },
      shippingPrice,
      totalOrderPrice: cart.totalCartPrice + shippingPrice,
      paymentMethod,
      idempotencyKey,
      orderStatus: "created",
    });

    await order.save({ session });

    //5- DECREMENT STOCK INCREMENT SOLD
    for (const item of cart.cartItems) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        { session },
      );
    }

    //6- CLEAR CART
    cart.cartItems = [];
    cart.totalCartPrice = 0;
    await cart.save({ session });

    // COMMIT
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    // duplicate key error handling
    if (error.code === 11000 && error.keyPattern?.idempotencyKey) {
      const existingOrder = await orderModel.findOne({ idempotencyKey });
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        status: "success",
        message: "Order already created",
        data: existingOrder,
      });
    }

    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

exports.createFilterObject = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    console.log(req.user.id);
    req.filterObject = { user: req.user.id };
  }
  next();
});

exports.getAllOrders = getAll(orderModel, {
  path: "orderItems.product",
  select: "code imageCover price",
});
exports.getOrderById = getOne(orderModel, {
  path: "orderItems.product",
  select: "code imageCover price",
});
exports.deleteOrder = deleteOne(orderModel);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new apiError("Order not found", 404));
  }
  if (order.isCanceled) {
    return next(new apiError("This Order Has Been Canceled", 400));
  }
  if (order.isPaid) {
    return next(new apiError("Order already paid", 400));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = "paid";

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new apiError("Order not found", 404));
  }

  if (order.isCanceled) {
    return next(new apiError("This Order Has Been Canceled", 400));
  }

  if (order.isDelivered) {
    return next(new apiError("Order already delivered", 400));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.orderStatus = "delivered";

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await orderModel.findById(req.params.id).session(session);

    if (!order) {
      throw new apiError("Order not found", 404);
    }

    //rules

    if (order.isDelivered) {
      throw new apiError("Delivered order cannot be canceled", 400);
    }

    if (order.isCanceled) {
      throw new apiError("Order already canceled", 400);
    }

    //1- ROLLBACK STOCK (SOLD & QUANTITY)
    for (const item of order.orderItems) {
      await productModel.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            quantity: item.quantity,
            sold: -item.quantity,
          },
        },
        { session },
      );
    }

    // 2- UPDATE ORDER STATUS
    order.isCanceled = true;
    order.canceledAt = Date.now();
    order.orderStatus = "canceled";

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Order canceled successfully",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});
