const express = require("express");
const {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
  updateProductPrices,
} = require("../controllers/categoryController");
const {
  getCategoryByIdValidator,
  deleteCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");
const { auth, allowedTo } = require("../controllers/authController");

const upload = require("../middleware/uploadImage");
const router = express.Router();

router
  .route("/:id")
  .get(getCategoryByIdValidator, getCategoryById)
  .delete(auth, allowedTo("admin"), deleteCategoryValidator, deleteCategory)
  .patch(
    auth,
    allowedTo("admin"),
    upload.single("image"),
    updateCategoryValidator,
    updateProductPrices,
    updateCategory,
  );
router
  .route("/")
  .get(getAllCategories)
  .post(
    auth,
    allowedTo("admin"),
    upload.single("image"),
    createCategoryValidator,
    createCategory,
  );

module.exports = router;
