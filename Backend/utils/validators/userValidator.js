const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.checkIdValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("name").optional().isString().withMessage("User name must be string"),
  check("phone").optional(),
  validatorMiddleware,
];
