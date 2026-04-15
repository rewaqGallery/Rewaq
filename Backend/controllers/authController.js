const bcryptjs = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const pendingUserModel = require("../models/pendingUserModel");
const userModel = require("../models/userModel");
// const sendEmail = require("../utils/sendEmail");
const sendEmail = require("../utils/resend");
const createToken = require("../utils/tokens");
const apiError = require("../utils/apiError");

exports.signup = asyncHandler(async (req, res, next) => {
  //in validator check if email exists in userModel, pendingUser
  //in validator check for passConfirm
  let { name, email, password } = req.body;
  let hashedPass = await bcryptjs.hash(password, 12);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  await pendingUserModel.create({
    name,
    email,
    password: hashedPass,
    otp: hashedOtp,
    otpExpiresIn: Date.now() + 5 * 60 * 1000,
  });

  await sendEmail({
    name,
    email,
    subject: "Use OTP To Verify Acc",
    message: `Hello ${name}, Your OTP is ${otp}`,
  });

  res.status(200).json({ message: "OTP Send To Your Email" });
});

module.exports.verify = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Missing OTP or email" });

  let pendingUser = await pendingUserModel.findOne({ email });
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (!pendingUser) {
    return res
      .status(400)
      .json({ message: "Account not found or already verified" });
  } else {
    if (pendingUser.otp != hashedOtp || pendingUser.otpExpiresIn < Date.now()) {
      res.status(400).json({ message: "wrong OTP or otp have been expired " });
    } else {
      let newUser = {
        email: pendingUser.email,
        password: pendingUser.password,
        name: pendingUser.name,
      };
      let user = await userModel.create(newUser);
      await pendingUserModel.deleteOne({ email });
      let token = createToken(user);
      res.status(201).json({ message: "User Created Successfully", token });
    }
  }
});

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = createToken(user);
  user = { name: user.name, email: user.email }; //for clean return
  res.status(200).json({ message: "Login successful", data: user, token });
});

exports.auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new apiError("You are Not Logging In", 401));
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new apiError("Invalid or expired token", 401));
  }
  const currentUser = await userModel
    .findById(decoded.userId)
    .select(`+password +passwordChangedAt +role`);
  if (!currentUser) {
    return next(
      new apiError("The User Belong To This Token Is No Longer Exist", 401),
    );
  }

  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new apiError(
          "User Recently Change His Password Please Login Again...",
          401,
        ),
      );
    }
  }

  req.user = { id: currentUser._id, role: currentUser.role };
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError("You Are Not Allowed To Access This Route", 403),
      );
    }
    next();
  });

///////////////////////////////////////////////////////////////////
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new apiError("No User For This Email", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpires = Date.now() + 2 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  try {
    await sendEmail({
      email: user.email,
      name: user.name,
      subject: "Your Password Reset Code(Valid For 2min)",
      message: `Hi ${user.name},\n
      We Received A Request To Reset Password On Account.\n
      ${resetCode}\n 
      Enter This Code To Compelete Reset. \n`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new apiError("There Is An Error In Sending Email", 500));
  }
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Reset Code Sent To Email " });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.passwordResetCode)
    .digest("hex");
  const user = await userModel
    .findOne({
      passwordResetCode: hashedResetCode,
      passwordResetCodeExpires: { $gt: Date.now() },
    })
    .select("+passwordResetVerified");
  if (!user) {
    return next(new apiError("Reset Code Invalid Or Expired", 400));
  }

  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+passwordResetVerified ");
  if (!user) {
    return next(new apiError("There Is No userModel For This Email", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new apiError("Reset Code Not Verified", 400));
  }

  const hashedPassword = await bcryptjs.hash(req.body.newPassword, 12);
  user.password = hashedPassword;
  user.passwordChangedAt = Date.now();

  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = createToken(user);
  res.status(200).json({
    message: "Password reset successfully",
    token,
  });
});

exports.google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallBack = [
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  async (req, res) => {
    const user = req.user;
    const token = createToken({ _id: user._id, role: user.role });
    // const { password, ...safeUser } = user.toObject();

    // res.redirect(`http://localhost:5173/google-success?token=${token}`);
    res.redirect(
      // `https://rewaq-gallery.vercel.app/google-success?token=${token}`,
      `https://rewaqgallery.com/google-success?token=${token}`,
    );
  },
];

exports.directSignup = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;
  let hashedPass = await bcryptjs.hash(password, 12);
  let newUser = {
    email: email,
    password: hashedPass,
    name: name,
  };
  let user = await userModel.create(newUser);
  let token = createToken(user);
  res.status(201).json({ message: "User Created Successfully", token });
});
