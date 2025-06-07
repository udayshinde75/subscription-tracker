# Subscription Tracker API

A robust subscription management system that helps users track and manage their subscriptions with automated renewal reminders.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Subscription Management](#subscription-management)
- [Workflow System](#workflow-system)
- [Security Features](#security-features)
- [Environment Variables](#environment-variables)
- [Setup and Installation](#setup-and-installation)

## Features
- User authentication and authorization
- Subscription CRUD operations
- Automated email reminders for subscription renewals
- Role-based access control (Admin and User roles)
- Rate limiting and bot protection
- MongoDB transactions for data consistency
- Email notifications using Nodemailer
- Background job processing with Upstash

## Tech Stack
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **Background Jobs**: Upstash Workflow
- **Security**: Arcjet (Rate limiting, Bot protection)
- **Date Handling**: Day.js

## Project Structure
```
├── config/                 # Configuration files
│   ├── env.js             # Environment variables
│   ├── nodemailer.js      # Email configuration
│   ├── upstash.js         # Upstash workflow config
│   └── arcjet.js          # Security configuration
├── controllers/           # Request handlers
│   ├── auth.controller.js # Authentication logic
│   ├── user.controller.js # User management
│   ├── subscription.controller.js # Subscription operations
│   └── workflow.controller.js # Reminder workflows
├── database/             # Database configuration
│   └── mongodb.js        # MongoDB connection
├── middlewares/          # Express middlewares
│   ├── auth.middleware.js # JWT authentication
│   ├── error.middleware.js # Error handling
│   └── arcjet.middleware.js # Security middleware
├── models/              # Database models
│   ├── user.model.js    # User schema
│   └── subscription.model.js # Subscription schema
├── routes/             # API routes
│   ├── auth.routes.js  # Authentication routes
│   ├── user.routes.js  # User routes
│   ├── subscription.routes.js # Subscription routes
│   └── workflow.route.js # Workflow routes
└── utils/             # Utility functions
    ├── errorResponse.js # Custom error class
    ├── email-template.js # Email templates
    └── send-email.js   # Email sending utility
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/sign-up
Content-Type: application/json

{
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "string" // optional, defaults to "User"
}
```
**Response**: `201 Created`
```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "user": {
            "id": "string",
            "name": "string",
            "email": "string",
            "role": "string"
        },
        "token": "string"
    }
}
```

#### Login
```http
POST /api/v1/auth/sign-in
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```
**Response**: `200 OK`
```json
{
    "success": true,
    "message": "User signed in successfully",
    "data": {
        "token": "string",
        "user": {
            "id": "string",
            "name": "string",
            "email": "string",
            "role": "string"
        }
    }
}
```

#### Logout
```http
POST /api/v1/auth/sign-out
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "title": "Sign Out"
}
```

### User Endpoints

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": [
        {
            "id": "string",
            "name": "string",
            "email": "string",
            "role": "string"
        }
    ]
}
```

#### Get User Details
```http
GET /api/v1/users/:id
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string"
    }
}
```

### Subscription Endpoints

#### Create Subscription
```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "price": "number",
    "currency": "string",
    "frequency": "string",
    "renewalDate": "date",
    "paymentMethod": "string"
}
```
**Response**: `201 Created`
```json
{
    "success": true,
    "data": {
        "id": "string",
        "name": "string",
        "price": "number",
        "currency": "string",
        "frequency": "string",
        "renewalDate": "date",
        "paymentMethod": "string",
        "status": "string",
        "user": "string"
    },
    "workflowRunId": "string"
}
```

#### Get All Subscriptions (Admin)
```http
GET /api/v1/subscriptions
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": [
        {
            "id": "string",
            "name": "string",
            "price": "number",
            "currency": "string",
            "frequency": "string",
            "renewalDate": "date",
            "paymentMethod": "string",
            "status": "string",
            "user": "string"
        }
    ]
}
```

#### Get User Subscriptions
```http
GET /api/v1/subscriptions/user/:id
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": [
        {
            "id": "string",
            "name": "string",
            "price": "number",
            "currency": "string",
            "frequency": "string",
            "renewalDate": "date",
            "paymentMethod": "string",
            "status": "string"
        }
    ]
}
```

#### Get Subscription Details
```http
GET /api/v1/subscriptions/:id
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "id": "string",
        "name": "string",
        "price": "number",
        "currency": "string",
        "frequency": "string",
        "renewalDate": "date",
        "paymentMethod": "string",
        "status": "string",
        "user": "string"
    }
}
```

#### Update Subscription
```http
PUT /api/v1/subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "price": "number",
    "currency": "string",
    "frequency": "string",
    "renewalDate": "date",
    "paymentMethod": "string"
}
```
**Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "id": "string",
        "name": "string",
        "price": "number",
        "currency": "string",
        "frequency": "string",
        "renewalDate": "date",
        "paymentMethod": "string",
        "status": "string",
        "user": "string"
    }
}
```

#### Delete Subscription
```http
DELETE /api/v1/subscriptions/:id
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "message": "Subscription deleted successfully"
}
```

#### Cancel Subscription
```http
PUT /api/v1/subscriptions/:id/cancel
Authorization: Bearer <token>
```
**Response**: `200 OK`
```json
{
    "success": true,
    "message": "Subscription cancelled successfully",
    "data": {
        "id": "string",
        "name": "string",
        "status": "cancelled"
    }
}
```

## Authentication
- JWT-based authentication
- Token expiration configurable via environment variables
- Role-based access control (Admin and User roles)
- Protected routes require valid JWT token

## Subscription Management
- CRUD operations for subscriptions
- MongoDB transactions for data consistency
- User-specific subscription access
- Admin access to all subscriptions
- Subscription status tracking
- Automated renewal reminders

## Workflow System
- Automated email reminders at 7, 5, 2, and 1 days before renewal
- Upstash workflow for reliable background processing
- Email templates with subscription details
- Configurable reminder intervals

## Security Features
- Arcjet integration for:
  - Rate limiting (5 requests per 10 seconds)
  - Bot detection and protection
  - IP-based request tracking
- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control

## Environment Variables
```env
PORT=3000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/subscription-service
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
ARCJET_ENV=development
ARCJET_KEY=your_arcjet_key
QSTASH_TOKEN=your_qstash_token
QSTASH_URL=your_qstash_url
SERVER_URL=http://localhost:3000
EMAIL_PASSWORD=your_email_password
```

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
cd subscription-tracker
```

2. Install dependencies
```bash
npm install
```

3. Create environment files
```bash
cp .env.example .env.development.local
```

4. Update environment variables in `.env.development.local`

5. Start the development server
```bash
npm run dev
```

6. For production
```bash
npm run build
npm start
```

## Error Handling
The API uses a centralized error handling system with custom error responses:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 429: Too Many Requests
- 500: Internal Server Error
