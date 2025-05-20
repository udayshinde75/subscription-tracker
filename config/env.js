/**
 * Environment Configuration
 * Loads and exports environment variables from the appropriate .env file
 * Uses dotenv to load environment variables based on NODE_ENV
 */

import { config } from 'dotenv';    

// Load environment variables from the appropriate .env file
// Format: .env.{NODE_ENV}.local (e.g., .env.development.local)
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

// Export commonly used environment variables
export const {
    PORT,           // Server port number
    NODE_ENV,       // Current environment (development/production)
    DB_URI,         // MongoDB connection URI
    JWT_SECRET,     // Secret key for JWT token generation
    JWT_EXPIRY,     // JWT token expiration time
    ARCJET_ENV,     // Arcjet environment configuration
    ARCJET_KEY,     // Arcjet API key
    QSTASH_TOKEN,   // QStash authentication token
    QSTASH_URL,     // QStash service URL
    SERVER_URL,     // Base URL of the server
    EMAIL_PASSWORD  // Email service password
} = process.env;