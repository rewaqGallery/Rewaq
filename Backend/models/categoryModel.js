const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      unique: [true, "Category Must Be Unique"],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    priceAfterDiscount: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({
  name: "text",
  description: "text",
});

categorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Category", categorySchema);
