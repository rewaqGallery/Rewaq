const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    shippingAddress: {
      detailedAddress: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: String,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    totalOrderPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    isCanceled: {
      type: Boolean,
      default: false,
    },
    canceledAt: Date,

    orderStatus: {
      type: String,
      enum: ["created", "paid", "delivered", "canceled"],
      default: "created",
    },
    
    idempotencyKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true });

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
