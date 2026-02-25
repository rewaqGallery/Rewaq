const httpMocks = require("node-mocks-http");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const { signup } = require("../controllers/authController");
const pendingUserModel = require("../models/pendingUserModel");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/nodemailer");
const ApiError = require("../utils/apiError");

// ✅ Mock same exact paths used in controller
jest.mock("../models/pendingUserModel");
jest.mock("../models/userModel");
jest.mock("../utils/nodemailer");
jest.mock("bcryptjs");

describe("Signup Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "Mohamed",
        email: "test@test.com",
        password: "123456",
      },
    });

    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // ✅ SUCCESS CASE
  // ===============================
  it("should create pending user and send OTP email", async () => {
    // mock dependencies
    bcryptjs.hash.mockResolvedValue("hashedPassword");

    pendingUserModel.create.mockResolvedValue({
      email: "test@test.com",
    });

    sendEmail.mockResolvedValue(true);

    await signup(req, res, next);

    // password hashed
    expect(bcryptjs.hash).toHaveBeenCalledWith("123456", 12);

    // pending user created
    expect(pendingUserModel.create).toHaveBeenCalledTimes(1);

    // email sent
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@test.com",
        subject: expect.any(String),
        message: expect.stringContaining("OTP"),
      })
    );

    // response check
    expect(res.statusCode).toBe(200);

    const data = res._getJSONData();
    expect(data.message).toBe("OTP Send To Your Email");

    // next not called
    expect(next).not.toHaveBeenCalled();
  });

  // ===============================
  // ❌ EMAIL SEND FAIL
  // ===============================
  it("should call next with ApiError if sending email fails", async () => {
    bcryptjs.hash.mockResolvedValue("hashedPassword");

    pendingUserModel.create.mockResolvedValue({
      email: "test@test.com",
    });

    sendEmail.mockRejectedValue(new Error("Email failed"));

    await signup(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
  });

  // ===============================
  // ❌ DATABASE FAIL
  // ===============================
  it("should call next if database create fails", async () => {
    bcryptjs.hash.mockResolvedValue("hashedPassword");

    pendingUserModel.create.mockRejectedValue(
      new Error("DB Error")
    );

    await signup(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
  });
});