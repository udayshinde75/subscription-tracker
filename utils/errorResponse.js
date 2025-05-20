/**
 * Error Response Utility
 * Custom error class that extends the built-in Error class
 * Adds status code to error objects for better error handling
 */

class ErrorResponse extends Error {
    /**
     * Create a new error response
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;