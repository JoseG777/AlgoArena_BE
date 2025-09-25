import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing URI");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
};