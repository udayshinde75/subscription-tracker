/**
 * Workflow Controller
 * Handles subscription reminder workflows using Upstash
 * Manages automated email reminders for subscription renewals
 */

import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

// Days before renewal to send reminders
const REMINDERS = [7, 5, 2, 1]

/**
 * Main workflow handler for subscription reminders
 * @async
 * @function sendReminders
 * @param {Object} context - Workflow context object
 * @returns {Promise<void>}
 */
export const sendReminders = serve(async (context) => {
  // Get subscription ID from request payload
  const { subscriptionId } = context.requestPayload;
  
  // Fetch subscription details
  const subscription = await fetchSubscription(context, subscriptionId);

  // Skip if subscription doesn't exist or is not active
  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  // Stop workflow if renewal date has passed
  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  // Process each reminder interval
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    // Sleep until reminder date if it's in the future
    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    // Send reminder if it's the reminder date
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

/**
 * Fetch subscription details with user information
 * @async
 * @function fetchSubscription
 * @param {Object} context - Workflow context object
 * @param {string} subscriptionId - ID of the subscription
 * @returns {Promise<Object>} Subscription details with user information
 */
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

/**
 * Sleep until a specific reminder date
 * @async
 * @function sleepUntilReminder
 * @param {Object} context - Workflow context object
 * @param {string} label - Label for the reminder
 * @param {Object} date - Date to sleep until
 */
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

/**
 * Trigger a reminder email
 * @async
 * @function triggerReminder
 * @param {Object} context - Workflow context object
 * @param {string} label - Label for the reminder
 * @param {Object} subscription - Subscription details
 */
const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    console.log(subscription.user.email)
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}