/**
 * Error Handling Middleware
 * Global error handler for the application
 * Handles various types of errors including:
 * - Mongoose validation errors
 * - Duplicate key errors
 * - Invalid ObjectId errors
 * - General server errors
 */

import ErrorResponse from "../utils/errorResponse.js";

/**
 * Global error handling middleware
 * @function errorMiddleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with error details
 */
const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.log(err);

        // Handle Mongoose invalid ObjectId error
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorResponse(message, 404);
        }

        // Handle Mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate field value entered`;
            error = new ErrorResponse(message, 400);
        }

        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(message.join(', '), 400);
        }

        // Send error response
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default errorMiddleware;