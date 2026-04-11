const mongoose = require("mongoose");
const pendingUserSchema = new mongoose.Schema(
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
    },
    otp: String,
    otpExpiresIn: Date,
  },
  { timestamps: true },
);

pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 6 });
module.exports = mongoose.model("PendingUser", pendingUserSchema);
