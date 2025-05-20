/**
 * Subscription Routes
 * Defines routes for subscription management operations:
 * - Create subscription
 * - Get subscription details
 * - Update subscription
 * - Delete subscription
 * - Get user subscriptions
 * - Cancel subscription
 */

import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubcriptions, getSubscriptionDetails, getUserSubscriptions, updateSubscription } from "../controllers/subcription.controller.js";

const subscriptionRouter = Router();

/**
 * @route   GET /api/v1/subscriptions
 * @desc    Get all subscriptions (Admin only)
 * @access  Private
 */
subscriptionRouter.get("/", authorize, getAllSubcriptions);

/**
 * @route   GET /api/v1/subscriptions/:id
 * @desc    Get details of a specific subscription
 * @access  Private
 */
subscriptionRouter.get("/:id", authorize, getSubscriptionDetails);

/**
 * @route   POST /api/v1/subscriptions
 * @desc    Create a new subscription
 * @access  Private
 */
subscriptionRouter.post("/", authorize, createSubscription);

/**
 * @route   PUT /api/v1/subscriptions/:id
 * @desc    Update a subscription
 * @access  Private
 */
subscriptionRouter.put("/:id", authorize, updateSubscription);

/**
 * @route   DELETE /api/v1/subscriptions/:id
 * @desc    Delete a subscription
 * @access  Private
 */
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

/**
 * @route   GET /api/v1/subscriptions/user/:id
 * @desc    Get all subscriptions for a specific user
 * @access  Private
 */
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

/**
 * @route   PUT /api/v1/subscriptions/:id/cancel
 * @desc    Cancel a subscription
 * @access  Private
 */
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

export default subscriptionRouter;
