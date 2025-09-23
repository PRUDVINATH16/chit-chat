import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Proper __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for JSON parsing
app.use(express.json());

// 🔑 Serve static files for dev (optional if you only serve in prod)
app.use(express.static(path.join(__dirname, "client")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// 👉 Serve client in production
if (process.env.NODE_ENV === "production") {
  // Absolute path to the client build folder
  const clientPath = path.join(__dirname, "../../client");

  // Serve static assets from that folder
  app.use(express.static(clientPath));

  // Catch-all route to index.html for SPA routing
  // Use a *string* pattern, not a regex literal
  app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
