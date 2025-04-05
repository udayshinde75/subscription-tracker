import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
        DB_URI,
        {
            dbName: "subscription-service",
        }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;