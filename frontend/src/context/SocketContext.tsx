"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "../api/auth.api";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    // Create socket connection
    const socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setConnected(true);

      // Authenticate socket with JWT token
      const token = getToken();
      if (token) {
        socketInstance.emit("authenticate", token);
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
    });

    socketInstance.on("authentication_error", (error) => {
      console.error("Socket authentication error:", error);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Connect socket
    socketInstance.connect();

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
