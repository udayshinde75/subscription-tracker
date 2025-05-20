/**
 * MongoDB Connection Configuration
 * Sets up and exports a function to establish connection with MongoDB database
 * Uses mongoose as the ODM (Object Document Mapper)
 */

import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

// Validate environment variable
if (!DB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
}

/**
 * Establishes connection to MongoDB database
 * @async
 * @function connectDB
 * @throws {Error} If connection fails
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
        DB_URI,
        {
            dbName: "subscription-service", // Database name
        }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
}

export default connectDB;