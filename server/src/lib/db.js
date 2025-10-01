import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI)

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:\n\n", error);
    process.exit(1); // Exit process with failure
  }
}