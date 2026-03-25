const {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  getOne,
} = require("./handlersFactory");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const { image } = require("../config/cloudinary");

exports.deleteProduct = deleteOne(productModel);
exports.getProductById = getOne(productModel, {
  path: "category",
  select: "name price description _id",
});
exports.getAllProducts = getAll(productModel, {
  path: "category",
  select: "name price description _id",
});

exports.setPriceFromCategory = async (req, res, next) => {
  if (req.body.price === undefined && req.body.category) {
    const category = await categoryModel.findById(req.body.category);

    if (!category) {
      return next(new apiError("Category not found", 404));
    }

    req.body.price = category.price;
  }
  next();
};

exports.createProduct = createOne(
  productModel,
  [
    "code",
    "description",
    "quantity",
    "price",
    "sold",
    "priceAfterDiscount",
    "category",
    "tags",
    "tagsText",
    "imageCover",
    "images",
    "featured",
  ],
  "products",
);

exports.updateProduct = updateOne(
  productModel,
  [
    "code",
    "description",
    "quantity",
    "price",
    "priceAfterDiscount",
    "sold",
    "category",
    "tags",
    "tagsText",
    "imageCover",
    "images",
    "featured",
  ],
  "products",
);
