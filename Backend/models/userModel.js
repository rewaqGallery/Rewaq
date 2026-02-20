const mongoose = require("mongoose");
  const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: { type: Date, select: false },
    passwordResetCode: { type: String, select: false },
    passwordResetCodeExpires: { type: Date, select: false },
    passwordResetVerified: { type: Boolean, select: false },

    favourites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    phone: String,
    profileImage: {
      url: String,
      public_id: String,
    },
    address: {
      detailedAddress: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true },
);
userSchema.index({ name: "text", email: "text" });
module.exports = mongoose.model("User", userSchema);
