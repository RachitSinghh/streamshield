require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const setupSocketHandlers = require("./sockets/processing.socket");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
setupSocketHandlers(io);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.io: http://localhost:${PORT}`);
      console.log(`\n✅ Server ready to accept connections\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

// Start the server
startServer();
