import { Server } from "socket.io";
import http from "http";
import express from "express";
import "dotenv/config";
import { socketAuthMiddlware } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }
});

io.use(socketAuthMiddlware);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected - ", socket.user.fullName);

  userSocketMap[socket.userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected - ", socket.user.fullName);
    delete userSocketMap[socket.userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io, app };
