/**
 * Nodemailer Configuration
 * Sets up and exports a configured nodemailer transporter for sending emails
 * Uses Gmail as the email service provider
 */

import nodemailer from 'nodemailer';

import { EMAIL_PASSWORD } from './env.js'

// Email account to be used for sending emails
export const accountEmail = 'dadashinde247@gmail.com';

/**
 * Configured nodemailer transporter
 * Uses Gmail SMTP service with authentication
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  }
})

export default transporter;