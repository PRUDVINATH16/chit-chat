import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for JSON parsing
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Serve client in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from client folder
  app.use(express.static(path.join(__dirname, "../client")));

  // Catch-all route to serve index.html for SPA routing
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});