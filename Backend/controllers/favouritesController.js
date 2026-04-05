const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

exports.getLoggedUserFavourites = asyncHandler(async (req, res, next) => {
  function hundleSelectedFields(req) {
    if (req.query.fields) {
      const fields = req.query.fields
        ? req.query.fields.split(",").join(" ")
        : null;
      return fields;
    }
  }
  let fields = hundleSelectedFields(req);

  const user = await userModel
    .findById(req.user.id)
    .select("favourites")
    .populate({
      path: "favourites",
      select: fields || "code price category priceAfterDiscount description imageCover",
    });

  if (!user) {
    return next(new apiError("Login First", 404));
  }

  res.status(200).json({
    itemsCount: user.favourites.length,
    data: user.favourites,
  });
});

exports.addProductToFavourites = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { favourites: req.body.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Product Added Suceessfully To Your Favourites",
    data: user.favourites,
  });
});

exports.removeProductFromFavourites = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { favourites: req.body.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Product Removed SuceesFully From Your Favourites",
    data: user.favourites,
  });
});
