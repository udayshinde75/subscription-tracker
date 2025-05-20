/**
 * Arcjet Security Middleware
 * Implements security features using Arcjet including:
 * - Rate limiting
 * - Bot detection
 * - Access control
 */

import aj from "../config/arcjet.js";
import { ARCJET_ENV } from "../config/env.js";

/**
 * Middleware to protect routes using Arcjet security features
 * @async
 * @function arcjetMiddleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Response with error message if access is denied
 */
const arcjetMiddleware = async (req, res, next) => {
  try {
    // Get security decision from Arcjet
    const decision = await aj.protect(req, { requested: 1 });
    //console.log("Arcjet Decision:", decision);
    // if (decision.isDenied) {
    //   if (decision.reason.isRateLimit()) {
    //     return res.status(429).json({ message: "Too many requests" });
    //   }
    //   if (decision.reason.isBot?.()) {
    //     return res.status(403).json({ message: "Bot detected" });
    //   }

    //   return res.status(403).json({ message: "Access denied" });
    // }
    // Handle denied access cases
    if (decision.conclusion === "DENY") {
      // Handle rate limiting
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({ message: "Too many requests" });
      }
      // Handle bot detection
      if (decision.reason?.isBot?.()) {
        return res.status(403).json({ message: "Bot detected" });
      }
      // Handle general access denial
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    console.log(`Arcjet Middleware Error: ${err}`);
    next(err);
  }
};

export default arcjetMiddleware;
