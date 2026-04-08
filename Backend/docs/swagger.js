const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Rewaq Backend API",
      version: "1.0.0",
      description: "Complete API documentation for Rewaq backend services.",
    },
    servers: [
      {
        url: "http://localhost:9001",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Category" },
      { name: "Product" },
      { name: "Favourites" },
      { name: "Cart" },
      { name: "Order" },
      { name: "User" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Image: {
          type: "object",
          properties: {
            url: { type: "string", format: "uri" },
            public_id: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
            phone: { type: "string" },
            profileImage: { $ref: "#/components/schemas/Image" },
            address: {
              type: "object",
              properties: {
                detailedAddress: { type: "string" },
                city: { type: "string" },
                postalCode: { type: "string" },
              },
            },
            favourites: {
              type: "array",
              items: { type: "string" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            priceAfterDiscount: { type: "number" },
            description: { type: "string" },
            image: { $ref: "#/components/schemas/Image" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            code: { type: "string" },
            quantity: { type: "number" },
            sold: { type: "number" },
            price: { type: "number" },
            priceAfterDiscount: { type: "number" },
            description: { type: "string" },
            imageCover: { $ref: "#/components/schemas/Image" },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/Image" },
            },
            category: {
              oneOf: [
                { type: "string" },
                { $ref: "#/components/schemas/Category" },
              ],
            },
            featured: { type: "boolean" },
            tags: { type: "array", items: { type: "string" } },
            tagsText: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            product: {
              oneOf: [
                { type: "string" },
                { $ref: "#/components/schemas/Product" },
              ],
            },
            quantity: { type: "number" },
            price: { type: "number" },
            msg: { type: "string" },
            currentStock: { type: "number" },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            cartItems: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
            totalCartPrice: { type: "number" },
            totalPriceAfterDiscount: { type: "number", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            product: {
              oneOf: [
                { type: "string" },
                { $ref: "#/components/schemas/Product" },
              ],
            },
            quantity: { type: "number" },
            price: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            shippingAddress: {
              type: "object",
              properties: {
                detailedAddress: { type: "string" },
                phone: { type: "string" },
                city: { type: "string" },
                governorate: { type: "string" },
                postalCode: { type: "string" },
              },
            },
            shippingPrice: { type: "number" },
            totalOrderPrice: { type: "number" },
            paymentMethod: { type: "string", enum: ["card", "cash"] },
            isPaid: { type: "boolean" },
            paidAt: { type: "string", format: "date-time", nullable: true },
            isDelivered: { type: "boolean" },
            deliveredAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            isCanceled: { type: "boolean" },
            canceledAt: { type: "string", format: "date-time", nullable: true },
            orderStatus: {
              type: "string",
              enum: ["created", "paid", "delivered", "canceled"],
            },
            idempotencyKey: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        StandardError: {
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" },
            error: { type: "object" },
            stack: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Register account (OTP sent by email)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password", "passwordConfirm"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    passwordConfirm: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP sent" },
            400: { description: "Validation error" },
          },
        },
      },
      "/auth/verify": {
        post: {
          tags: ["Auth"],
          summary: "Verify account with OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: { type: "string", format: "email" },
                    otp: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User verified and token returned" },
            400: { description: "Invalid/expired OTP" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login success" },
            400: { description: "Invalid credentials" },
            429: { description: "Too many attempts" },
          },
        },
      },
      "/auth/forgetPassword": {
        post: {
          tags: ["Auth"],
          summary: "Send password reset code",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: { email: { type: "string", format: "email" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Code sent successfully" },
            404: { description: "User not found" },
          },
        },
      },
      "/auth/verifyPasswordResetCode": {
        post: {
          tags: ["Auth"],
          summary: "Verify password reset code",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["passwordResetCode"],
                  properties: { passwordResetCode: { type: "string" } },
                },
              },
            },
          },
          responses: {
            200: { description: "Code verified" },
            400: { description: "Invalid or expired code" },
          },
        },
      },
      "/auth/resetPassword": {
        patch: {
          tags: ["Auth"],
          summary: "Reset password after code verification",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "newPassword"],
                  properties: {
                    email: { type: "string", format: "email" },
                    newPassword: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password reset and token returned" },
            400: { description: "Reset code not verified" },
            404: { description: "User not found" },
          },
        },
      },
      "/auth/google": {
        get: {
          tags: ["Auth"],
          summary: "Start Google OAuth flow",
          responses: { 302: { description: "Redirect to Google OAuth" } },
        },
      },
      "/auth/google/callback": {
        get: {
          tags: ["Auth"],
          summary: "Google OAuth callback",
          responses: {
            302: { description: "Redirect with issued token" },
          },
        },
      },
      "/category": {
        get: {
          tags: ["Category"],
          summary: "Get categories (supports filter/search/pagination)",
          parameters: [
            { in: "query", name: "page", schema: { type: "integer" } },
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "sort", schema: { type: "string" } },
            { in: "query", name: "fields", schema: { type: "string" } },
            { in: "query", name: "keyword", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Categories list" } },
        },
        post: {
          tags: ["Category"],
          summary: "Create category (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["name", "price"],
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" },
                    priceAfterDiscount: { type: "number" },
                    description: { type: "string" },
                    image: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Category created" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/category/{id}": {
        get: {
          tags: ["Category"],
          summary: "Get category by id",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Category details" },
            404: { description: "Category not found" },
          },
        },
        patch: {
          tags: ["Category"],
          summary: "Update category and optionally propagate prices (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" },
                    priceAfterDiscount: { type: "number" },
                    description: { type: "string" },
                    image: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Category updated" } },
        },
        delete: {
          tags: ["Category"],
          summary: "Delete category (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 204: { description: "Category deleted" } },
        },
      },
      "/product": {
        get: {
          tags: ["Product"],
          summary: "Get products (supports filter/search/pagination)",
          parameters: [
            { in: "query", name: "page", schema: { type: "integer" } },
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "sort", schema: { type: "string" } },
            { in: "query", name: "fields", schema: { type: "string" } },
            { in: "query", name: "keyword", schema: { type: "string" } },
            { in: "query", name: "featured", schema: { type: "boolean" } },
          ],
          responses: { 200: { description: "Products list" } },
        },
        post: {
          tags: ["Product"],
          summary: "Create product (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["code", "quantity", "category"],
                  properties: {
                    code: { type: "string" },
                    quantity: { type: "number" },
                    sold: { type: "number" },
                    price: { type: "number" },
                    priceAfterDiscount: { type: "number" },
                    description: { type: "string" },
                    category: { type: "string" },
                    tags: {
                      oneOf: [
                        { type: "string", description: "JSON string array" },
                        { type: "array", items: { type: "string" } },
                      ],
                    },
                    tagsText: { type: "string" },
                    featured: { type: "boolean" },
                    imageCover: { type: "string", format: "binary" },
                    images: {
                      type: "array",
                      items: { type: "string", format: "binary" },
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Product created" } },
        },
      },
      "/product/{id}": {
        get: {
          tags: ["Product"],
          summary: "Get product by id",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Product details" } },
        },
        patch: {
          tags: ["Product"],
          summary: "Update product (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string" },
                    quantity: { type: "number" },
                    sold: { type: "number" },
                    price: { type: "number" },
                    priceAfterDiscount: { type: "number" },
                    description: { type: "string" },
                    category: { type: "string" },
                    tags: {
                      oneOf: [
                        { type: "string", description: "JSON string array" },
                        { type: "array", items: { type: "string" } },
                      ],
                    },
                    tagsText: { type: "string" },
                    featured: { type: "boolean" },
                    imagesMode: {
                      type: "string",
                      enum: ["replace", "append", "remove"],
                    },
                    removeImageId: { type: "string" },
                    imageCover: { type: "string", format: "binary" },
                    images: {
                      type: "array",
                      items: { type: "string", format: "binary" },
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Product updated" } },
        },
        delete: {
          tags: ["Product"],
          summary: "Delete product (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 204: { description: "Product deleted" } },
        },
      },
      "/favourites": {
        get: {
          tags: ["Favourites"],
          summary: "Get logged user favourites",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "fields",
              schema: { type: "string" },
              description: "Comma-separated selected fields for product",
            },
          ],
          responses: { 200: { description: "Favourites list" } },
        },
        post: {
          tags: ["Favourites"],
          summary: "Add product to favourites",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId"],
                  properties: { productId: { type: "string" } },
                },
              },
            },
          },
          responses: { 200: { description: "Product added to favourites" } },
        },
        delete: {
          tags: ["Favourites"],
          summary: "Remove product from favourites",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId"],
                  properties: { productId: { type: "string" } },
                },
              },
            },
          },
          responses: { 200: { description: "Product removed from favourites" } },
        },
      },
      "/cart": {
        get: {
          tags: ["Cart"],
          summary: "Get logged user cart",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Cart fetched" } },
        },
        post: {
          tags: ["Cart"],
          summary: "Add product to cart",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["productId"],
                  properties: {
                    productId: { type: "string" },
                    quantity: { type: "integer", minimum: 1, default: 1 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Product added to cart" } },
        },
        delete: {
          tags: ["Cart"],
          summary: "Clear logged user cart",
          security: [{ bearerAuth: [] }],
          responses: { 204: { description: "Cart cleared" } },
        },
      },
      "/cart/{id}": {
        patch: {
          tags: ["Cart"],
          summary: "Update cart item quantity",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "Product ID in cart item",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quantity"],
                  properties: { quantity: { type: "integer", minimum: 1 } },
                },
              },
            },
          },
          responses: { 200: { description: "Cart item updated" } },
        },
        delete: {
          tags: ["Cart"],
          summary: "Delete product from cart",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Item removed from cart" } },
        },
      },
      "/order": {
        get: {
          tags: ["Order"],
          summary: "Get orders (admin gets all, user gets own)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "page", schema: { type: "integer" } },
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "sort", schema: { type: "string" } },
            { in: "query", name: "fields", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Orders list" } },
        },
        post: {
          tags: ["Order"],
          summary: "Create order from current cart",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "detailedAddress",
                    "phone",
                    "city",
                    "governorate",
                    "idempotencyKey",
                  ],
                  properties: {
                    detailedAddress: { type: "string" },
                    phone: { type: "string" },
                    city: { type: "string" },
                    governorate: { type: "string" },
                    postalCode: { type: "string" },
                    shippingPrice: { type: "number", default: 0 },
                    paymentMethod: { type: "string", enum: ["cash", "card"] },
                    idempotencyKey: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Order created" },
            200: { description: "Idempotent duplicate request handled" },
            400: { description: "Cart empty or invalid data" },
          },
        },
      },
      "/order/{id}": {
        get: {
          tags: ["Order"],
          summary: "Get order by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Order details" } },
        },
        delete: {
          tags: ["Order"],
          summary: "Delete order (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 204: { description: "Order deleted" } },
        },
      },
      "/order/{id}/cancel": {
        patch: {
          tags: ["Order"],
          summary: "Cancel order and rollback stock (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Order canceled" } },
        },
      },
      "/order/{id}/pay": {
        patch: {
          tags: ["Order"],
          summary: "Mark order as paid (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Order marked as paid" } },
        },
      },
      "/order/{id}/deliver": {
        patch: {
          tags: ["Order"],
          summary: "Mark order as delivered (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Order marked as delivered" } },
        },
      },
      "/user/myProfile": {
        get: {
          tags: ["User"],
          summary: "Get logged user profile",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Profile returned" } },
        },
      },
      "/user/updateProfile": {
        patch: {
          tags: ["User"],
          summary: "Update logged user profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    phone: { type: "string" },
                    address: {
                      type: "string",
                      description:
                        "JSON string (example: {\"city\":\"Cairo\",\"postalCode\":\"12345\"})",
                    },
                    profileImage: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Profile updated" } },
        },
      },
      "/user": {
        get: {
          tags: ["User"],
          summary: "Get all users (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "page", schema: { type: "integer" } },
            { in: "query", name: "limit", schema: { type: "integer" } },
            { in: "query", name: "sort", schema: { type: "string" } },
            { in: "query", name: "fields", schema: { type: "string" } },
            { in: "query", name: "keyword", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Users list" } },
        },
      },
      "/user/{id}": {
        get: {
          tags: ["User"],
          summary: "Get user by id (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "User details" } },
        },
        delete: {
          tags: ["User"],
          summary: "Delete user by id (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 204: { description: "User deleted" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
