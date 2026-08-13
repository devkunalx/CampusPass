let io;

const init = (server) => {
  const { Server } = require("socket.io");

  const allowedOrigin =
    import.meta.env.VITE_API_URL || "http://localhost:5173";

  io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      credentials: true,
    },
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;
};

module.exports = {
  init,
  getIO,
};