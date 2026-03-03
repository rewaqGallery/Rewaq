const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true },
        msg: { type: String, default: "" },
        currentStock: { type: Number, default: 0 },
      },
    ],
    totalCartPrice: {
      type: Number,
      default: 0,
    },

    totalPriceAfterDiscount: Number,

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);
cartSchema.index({ user: 1 });

module.exports = mongoose.model("Cart", cartSchema);
