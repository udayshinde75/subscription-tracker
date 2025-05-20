/**
 * User Routes
 * Defines routes for user management operations:
 * - Get all users
 * - Get user details
 * - Create user
 * - Update user
 * - Delete user
 */

import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Public
 */
userRouter.get("/", getUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user details by ID
 * @access  Private
 */
userRouter.get("/:id", authorize, getUser);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @access  Public
 */
userRouter.post("/", (req, res) => {
  res.send({ title: "Create new User" }); 
});

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user by ID
 * @access  Private
 */
userRouter.put("/:id", (req, res) => {
  res.send({ title: "Update user by id" });
});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user by ID
 * @access  Private
 */
userRouter.delete("/:id", (req, res) => {
  res.send({ title: "Get All Users" });
});

export default userRouter;
