const express = require("express");
const router = express.Router();

const bouncer = require("express-bouncer")(
  10 * 1000, // MIN => 10 seconds
  60 * 60 * 1000, // MAX => 60 minutes
  10, // TRY => 10 attempts
);

bouncer.blocked = function (req, res, next) {
  res
    .status(429)
    .json({ message: "Too many attempts, please try again later" });
};

const {
  signup,
  verify,
  directSignup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
  googleCallBack,
  google,
} = require("../controllers/authController");

const {
  signupValidator,
  verifyAccountValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyPasswordResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/verify", verifyAccountValidator, verify);

router.post("/login", bouncer.block, loginValidator, login);

router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);

router.post(
  "/verifyPasswordResetCode",
  bouncer.block,
  verifyPasswordResetCodeValidator,
  verifyPasswordResetCode,
);

router.patch(
  "/resetPassword",
  bouncer.block,
  resetPasswordValidator,
  resetPassword,
);

router.get("/google", google);
router.get("/google/callback", googleCallBack);

router.post("/directSignup", signupValidator, directSignup);

module.exports = router;
