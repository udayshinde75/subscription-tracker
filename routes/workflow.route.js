/**
 * Workflow Routes
 * Defines routes for workflow operations:
 * - Send subscription reminders
 */

import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workfowRouter = Router();

/**
 * @route   POST /api/v1/workflows/subscription/reminder
 * @desc    Send subscription reminders
 * @access  Private
 */
workfowRouter.post('/subscription/reminder', sendReminders);

export default workfowRouter;