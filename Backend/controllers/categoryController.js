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
