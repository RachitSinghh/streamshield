const { verifyToken } = require("../utils/generateToken");

/**
 * Setup Socket.io event handlers
 * @param {Object} io - Socket.io instance
 */
const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Handle authentication
    socket.on("authenticate", (token) => {
      try {
        const decoded = verifyToken(token);
        socket.userId = decoded.id;
        socket.tenantId = decoded.tenantId;

        // Join user-specific room
        socket.join(decoded.id);

        console.log(`Socket ${socket.id} authenticated for user ${decoded.id}`);

        socket.emit("authenticated", {
          success: true,
          userId: decoded.id,
        });
      } catch (error) {
        console.error("Socket authentication error:", error);
        socket.emit("authentication_error", {
          success: false,
          message: "Invalid token",
        });
      }
    });

    // Handle join video room
    socket.on("join:video", (videoId) => {
      socket.join(`video:${videoId}`);
      console.log(`Socket ${socket.id} joined video room: ${videoId}`);
    });

    // Handle leave video room
    socket.on("leave:video", (videoId) => {
      socket.leave(`video:${videoId}`);
      console.log(`Socket ${socket.id} left video room: ${videoId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  console.log("Socket handlers registered");
};

module.exports = setupSocketHandlers;
