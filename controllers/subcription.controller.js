import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import mongoose from "mongoose";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id 
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
              subscriptionId: subscription.id,
            },
            headers: {
              'content-type': 'application/json',
            },
            retries: 0,
        })

        return res.status(201).json({ success: true, data: subscription, workflowRunId });
    } catch (error) {
        next(error);
    }
}


export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user:req.params.id});

        return res.status(200).json({success:true, data: subscriptions})
    } catch (err){
        next(err)
    }
}

export const getAllSubcriptions = async (req, res, next) => {
    try {
        if (req.user.role === "Administrator") {
            const subscriptions = await Subscription.find();
            return res.status(200).json({success:true, data: subscriptions})
        }

        const error = new Error('Only Administrator Can Access this.');
        error.status = 401;
        throw error;

    } catch (error) {
        next(error)
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        // Check if the user is an Administrator OR the owner of the subscription
        if (req.user.role !== "Administrator" && req.user.id !== req.params.id) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to access this subscription" 
            });
        }

        // Find subscription by ID
        const subscription = await Subscription.findById(req.params.id);

        // If subscription is not found, return 404
        if (!subscription) {
            return res.status(404).json({ 
                success: false, 
                message: "Subscription not found" 
            });
        }

        // Return subscription details
        res.status(200).json({ success: true, data: subscription });
        
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start MongoDB session
    session.startTransaction(); // Begin transaction

    try {
        const subscription = await Subscription.findById(req.params.id).session(session);

        // If subscription is not found, abort transaction
        if (!subscription) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        // Check if user is allowed to update
        if (req.user.role !== "Administrator" && req.user.id !== subscription.user.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ success: false, message: "Unauthorized to update this subscription" });
        }

        // Perform update inside the transaction
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true, session }
        );

        // Commit transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        // Send updated response
        res.status(200).json({ success: true, data: updatedSubscription });

    } catch (error) {
        await session.abortTransaction(); // Rollback changes on error
        session.endSession();
        next(error);
    }
};


export const deleteSubscription = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the subscription
        const subscription = await Subscription.findById(req.params.id).session(session);
        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        // Check if the user has permission (Admin can delete any, User can delete only their own)
        if (req.user.role !== "Administrator" && subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this subscription" });
        }

        // Delete the subscription
        await Subscription.findByIdAndDelete(req.params.id, { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass error to global error handler
    }
};

export const cancelSubscription = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the subscription
        const subscription = await Subscription.findById(req.params.id).session(session);
        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        // Check if the user has permission (Admin can cancel any, User can cancel only their own)
        if (req.user.role !== "Administrator" && subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to cancel this subscription" });
        }

        // Update the status to "Cancelled"
        subscription.status = "cancelled";
        await subscription.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Subscription cancelled successfully", data: subscription });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass error to global error handler
    }
};
