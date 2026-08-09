const mongoose = require("mongoose");
const config = require("./utils/config");


const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const logger = require("./utils/logger");


const { init } = require("./socket");

const io = init(server);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("serverMessage", {
  title: "Welcome!",
  message: "Connected to CampusPass realtime server.",
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

logger.info("Connecting to MongoDB...");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");

    server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
  })
  .catch((error) => {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });