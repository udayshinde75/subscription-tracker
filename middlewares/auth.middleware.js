/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 * Attaches authenticated user to request object
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

/**
 * Middleware to authorize requests using JWT
 * @async
 * @function authorize
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Response with error message if unauthorized
 */
export const authorize = async (req, res, next) => {
    try {
        let token;

        // Extract token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify token and decode user information
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decoded.userId);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};
