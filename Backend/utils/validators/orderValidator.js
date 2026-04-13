const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const orderModel = require("../../models/orderModel");
exports.createOrderValidator = [
  check("detailedAddress")
    .notEmpty()
    .withMessage("detailedAddress Required")
    .isString()
    .withMessage("Invalid detailedAddress Format"),

  check("name")
    .notEmpty()
    .withMessage("Name Required")
    .isString()
    .withMessage("Invalid Name Format"),

  check("city")
    .notEmpty()
    .withMessage("City Required")
    .isString()
    .withMessage("Invalid City Format"),

  check("governorate")
    .notEmpty()
    .withMessage("Governorate Required")
    .isString()
    .withMessage("Invalid Governorate Format"),

  check("phone")
    .notEmpty()
    .withMessage("Phone Required")
    .matches(/^[0-9]{11}$/)
    .withMessage("Phone must be a valid Egyptian mobile number"),

  check("postalCode")
    .optional()
    .isString()
    .withMessage("Invalid Postal Code Format"),

  check("shippingPrice")
    .optional()
    .isNumeric()
    .withMessage("Shipping Price Must Be A Number"),

  check("paymentMethod")
    .toLowerCase()
    .optional()
    .isString()
    .withMessage("Invalid Payment Method Format")
    .isIn(["card", "cash"])
    .withMessage("Payment Method Must Be card or cash"),

  check("idempotencyKey")
    .notEmpty()
    .withMessage("idempotencyKey Required")
    .isString()
    .withMessage("Invalid idempotencyKey Format"),

  validatorMiddleware,
];

exports.getOrderByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid ID Format")
    .custom(async (value, { req }) => {
      let order = await orderModel.findById(value);
      if (!order) {
        return Promise.reject(new Error("Order not found"));
      }

      if (
        order.user.toString() != req.user.id.toString() &&
        req.user.role == "user"
      ) {
        return Promise.reject(
          new Error("You Are Not Allowed To Acess This Order"),
        );
      }
      return true;
    }),
  validatorMiddleware,
];
exports.orderIDValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format"),
  validatorMiddleware,
];
