/**
 * Authentication Routes
 * Defines routes for user authentication operations:
 * - User registration (sign up)
 * - User login (sign in)
 * - User logout (sign out)
 */

import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();    

/**
 * @route   POST /api/v1/auth/sign-up
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post('/sign-up', signUp)

/**
 * @route   POST /api/v1/auth/sign-in
 * @desc    Authenticate user & get token
 * @access  Public
 */
authRouter.post('/sign-in', signIn)

/**
 * @route   POST /api/v1/auth/sign-out
 * @desc    Logout user
 * @access  Private
 */
authRouter.post('/sign-out', authorize, signOut)

export default authRouter;