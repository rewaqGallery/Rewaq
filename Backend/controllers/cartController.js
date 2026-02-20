const asyncHandler = require("express-async-handler");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const apiError = require("../utils/apiError");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

const populateCart = (cartQuery) =>
  cartQuery.populate({
    path: "cartItems.product",
    select: "imageCover code price _id",
  });

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const qty = quantity && quantity > 0 ? quantity : 1;
  let msg;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new apiError("No Product Found", 404));
  }

  let cart = await cartModel.findOne({ user: req.user.id });

  if (!cart) {
    if (quantity > product.quantity) {
      msg = `Only ${product.quantity >= 0 ? product.quantity : 0} left in stock for "${product.description}". Extra quantity will be pre-ordered.`;
    }

    cart = await cartModel.create({
      user: req.user.id,
      cartItems: [
        {
          product: productId,
          quantity: qty,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex !== -1) {
      const newQty = cart.cartItems[productIndex].quantity + qty;

      if (newQty > product.quantity) {
        msg = `Only ${product.quantity >= 0 ? product.quantity : 0} left in stock for "${product.description}". Extra quantity will be pre-ordered.`;
      }

      cart.cartItems[productIndex].quantity = newQty;
    } else {
      if (qty > product.quantity) {
        msg = `Only ${product.quantity >= 0 ? product.quantity : 0} left in stock for "${product.description}". Extra quantity will be pre-ordered.`;
      }

      cart.cartItems.push({
        product: productId,
        quantity: qty,
        price: product.price,
      });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();

  const populatedCart = await populateCart(cartModel.findById(cart._id));

  res.status(200).json({
    status: "Success",
    message: "Product Added To Cart Successfully",
    msg,
    numberOfItems: populatedCart.cartItems.length,
    data: populatedCart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await populateCart(cartModel.findOne({ user: req.user.id }));

  res.status(200).json({
    status: "Success",
    message: "Get Cart Successfully",
    numberOfItems: cart ? cart.cartItems.length : 0,
    data: cart,
  });
});

exports.deleteProductFromCart = asyncHandler(async (req, res, next) => {
  let cart = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { cartItems: { product: req.params.id } } },
    { new: true },
  );

  if (!cart) {
    return next(new apiError("Cart Not Found", 404));
  }

  calcTotalCartPrice(cart);
  await cart.save();
  cart = await populateCart(cartModel.findById(cart._id));

  res.status(200).json({
    status: "Success",
    message: "Item Removed From Cart Successfully",
    numberOfItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user.id });
  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  let msg;

  if (!quantity || quantity < 1) {
    return next(new apiError("Quantity must be at least 1", 400));
  }

  const cart = await cartModel.findOne({ user: req.user.id });
  if (!cart) {
    return next(new apiError("There Is No Cart For This User", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.id,
  );

  if (itemIndex === -1) {
    return next(new apiError("There Is No Item For This ID", 404));
  }

  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new apiError("Product not found", 404));
  }

  if (quantity > product.quantity) {
    msg = `Only ${product.quantity >= 0 ? product.quantity : 0} left in stock for "${product.description}". Extra quantity will be pre-ordered.`;
  }

  cart.cartItems[itemIndex].quantity = quantity;

  calcTotalCartPrice(cart);
  await cart.save();

  const populatedCart = await populateCart(cartModel.findById(cart._id));

  res.status(200).json({
    status: "Success",
    message: "Update Cart Successfully",
    msg,
    numberOfItems: populatedCart.cartItems.length,
    data: populatedCart,
  });
});
