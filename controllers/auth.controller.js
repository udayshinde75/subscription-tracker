/**
 * Authentication Controller
 * Handles user authentication operations including:
 * - User registration (sign up)
 * - User login (sign in)
 * - User logout (sign out)
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

/**
 * Register a new user
 * @async
 * @function signUp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Created user and JWT token
 * @throws {Error} If user already exists or validation fails
 */
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract user data from request
    const {name, email, password, role} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const users = await User.create([{ name, email, password: hashedPassword, role }], { session });
    
    // Generate JWT token
    const token = jwt.sign({userId: users[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRY});

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response
    res.status(201).json({ 
        success: true,
        message: "User created successfully",
        data: { 
            user: users[0],
            token,
        }
    });

  } catch(error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Authenticate user and generate JWT token
 * @async
 * @function signIn
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User data and JWT token
 * @throws {Error} If credentials are invalid
 */
export const signIn = async (req, res, next) => {
  try {
    // Extract credentials from request
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRY});

    // Send response
    res.status(200).json({
        success: true,
        message: 'User signed in successfully',
        data: {
            token,
            user,
        }
    })
  } catch(error) {
    next(error);
  }
};

/**
 * Handle user logout
 * @function signOut
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Logout confirmation
 */
export const signOut = (req, res, next) => {
  res.send({ title: "Sign Out" });
} 