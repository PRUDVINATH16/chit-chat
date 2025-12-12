import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const socketAuthMiddlware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find( (row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket Auth Middleware: No token found in cookies");
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
      console.log("Socket Auth Middleware: Token verification failed");
      return next(new Error("Authentication error: Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket Auth Middleware: User not found");
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket Auth Middleware: User ${user.fullName} authenticated successfully`);
    next();
  } catch (e) {
    console.log("Socket Auth Middleware Error:", e);
  }
}
