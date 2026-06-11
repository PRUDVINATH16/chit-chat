import express from "express";
import dotenv from "dotenv";

dotenv.config();

import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import { server, app } from "./lib/socket.js";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chit-Chat API Server!" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Chit-Chat API is active and healthy 🚀" });
});

if (process.env.NODE_ENV === "production") {
  // const clientPath = path.join(__dirname, "../../client");
  // app.use(express.static(clientPath));
  // app.get(/.*/, (req, res) => {
  //   res.sendFile(path.join(clientPath, "index.html"));
  // });

  app.use(express.static(path.join(__dirname, "../../client/dist")));

  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, "../../client/", "dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
