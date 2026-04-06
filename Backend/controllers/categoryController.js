const asyncHandler = require("express-async-handler");
const {
  getAll,
  createOne,
  getOne,
  deleteOne,
  updateOne,
} = require("./handlersFactory");
const categoryModel = require("../models/categoryModel");
const apiError = require("../utils/apiError");
const productModel = require("../models/productModel");

exports.createCategory = createOne(
  categoryModel,
  ["name", "image", "price", "priceAfterDiscount", "description"],
  "Category",
);

exports.getAllCategories = getAll(categoryModel);
exports.deleteCategory = deleteOne(categoryModel);
exports.getCategoryById = getOne(categoryModel);
exports.updateCategory = updateOne(
  categoryModel,
  ["name", "image", "price", "priceAfterDiscount", "description"],
  "Category",
);

exports.updateProductPrices = asyncHandler(async (req, res, next) => {
  if (
    req.body.price === undefined &&
    req.body.priceAfterDiscount === undefined
  ) {
    return next();
  }

  await productModel.updateMany(
    { category: req.params.id },
    {
      ...(req.body.price !== undefined && { price: req.body.price }),
      ...(req.body.priceAfterDiscount !== undefined && {
        priceAfterDiscount: req.body.priceAfterDiscount,
      }),
    },
  );

  next();
});
