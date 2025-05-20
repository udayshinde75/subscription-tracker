/**
 * User Controller
 * Handles user-related operations including:
 * - Get all users
 * - Get user details
 */

import User from "../models/user.model.js";

/**
 * Get all users
 * @async
 * @function getUsers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} List of all users
 */
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user details by ID
 * @async
 * @function getUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User details (excluding password)
 * @throws {Error} If user is not found
 */
export const getUser = async (req, res, next) => {
    try {
        // Find user by ID and exclude password field
        const user = await User.findById(req.params.id).select('-password');

        // Check if user exists
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}