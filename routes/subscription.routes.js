import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubcriptions, getSubscriptionDetails, getUserSubscriptions, updateSubscription } from "../controllers/subcription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/",authorize, getAllSubcriptions);

subscriptionRouter.get("/:id", authorize, getSubscriptionDetails);

subscriptionRouter.post("/",authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

export default subscriptionRouter;
