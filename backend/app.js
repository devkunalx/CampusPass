const express = require("express");
const cors = require("cors");

const middleware = require("./utils/middleware");

const usersRouter = require("./controllers/user.js");
const loginRouter = require("./controllers/login.js");
const eventRouter = require("./controllers/event.js");
const adminRouter = require("./controllers/admin.js");
const studentsRouter = require("./controllers/student.js");

const authenticateUser = require("./middleware/authenticateUser.middleware.js");

const app = express();

const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.static("dist"));

app.use(express.json());

app.use(middleware.requestLogger);

// Routers

app.use("/api/users", usersRouter);

app.use("/api/login", loginRouter);

app.use(
  "/api/events",
  authenticateUser,
  eventRouter
);

app.use(
  "/api/students",
  authenticateUser,
  studentsRouter
);

app.use(
  "/api/admin",
  authenticateUser,
  adminRouter
);

// Error and endpoint middlewares

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;