import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workfowRouter = Router();

workfowRouter.post('/subscription/reminder',sendReminders);

export default workfowRouter;