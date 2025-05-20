/**
 * Email Sending Utility
 * Provides functionality to send subscription reminder emails
 * Uses nodemailer for email delivery and email templates for content
 */

import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

/**
 * Sends a subscription reminder email
 * @async
 * @function sendReminderEmail
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.type - Type of reminder email (e.g., "7 days before reminder")
 * @param {Object} params.subscription - Subscription details
 * @throws {Error} If required parameters are missing or email type is invalid
 */
export const sendReminderEmail = async ({ to, type, subscription }) => {
  // Validate required parameters
  if(!to || !type) throw new Error('Missing required parameters');

  // Find appropriate email template
  const template = emailTemplates.find((t) => t.label === type);
  if(!template) throw new Error('Invalid email type');

  // Prepare email content
  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  }

  // Generate email content
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  // Configure email options
  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) return console.log(error, 'Error sending email');
    console.log('Email sent: ' + info.response);
  })
}