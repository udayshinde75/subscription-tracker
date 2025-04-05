import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {name, email, password, role} = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const users = await User.create([{ name, email, password: hashedPassword,role }], { session });
    const token = jwt.sign({userId: users[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRY});

    await session.commitTransaction();
    session.endSession();

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

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({userId: user._id},JWT_SECRET,{expiresIn:JWT_EXPIRY});

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

export const signOut = (req, res, next) => {
  res.send({ title: "Sign Out" });
} 