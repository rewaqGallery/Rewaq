const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./config/db");
const mountRoutes = require("./routes/indexRoute");
const apiError = require("./utils/apiError");
const globalError = require("./middleware/globalError");
const cors = require("cors");
const compression = require("compression");
const passport = require("passport");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
dotenv.config({ path: ".env" });
require("./config/passport");

const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     credentials: true,
//   }),
// );
app.use(cors());
app.use(compression());
app.use(helmet());

// DB
dbConnection();

// Middlewares
app.use(express.json({ limit: 2 * 1024 * 1024 }));
app.use(express.urlencoded({ limit: 2 * 1024 * 1024, extended: true }));
app.use(passport.initialize());

// Routes
mountRoutes(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Handle undefined routes
app.use((req, res, next) => {
  next(new apiError(`Cannot Find This Route: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Server
const port = process.env.PORT || 9008;
const server = app.listen(port, () => {
  console.log("Connected on", port);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting Down...");
    process.exit(1);
  });
});
