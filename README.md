FieldSync Field Operations Management Platform

FieldSync is a full-stack field operations management platform that streamlines coordination between administrators, technicians, and clients. It manages the complete job lifecycle, from creation and assignment to completion and verification, with real-time workflow updates and notifications.

The platform combines a React frontend with a Node.js and GraphQL backend, providing role-based workspaces for operational management, field execution, and client communication.

Key Features

Role-Based Access Control: Separate permissions and workspaces for administrators, technicians, and clients.

Secure Authentication: JWT-based authentication and password hashing with bcryptjs.

Job Lifecycle Management: Create, assign, reassign, cancel, complete, reject, and verify jobs.

Technician Workspace: View assigned jobs, start tasks, and submit completion notes.

Administrative Dashboard: Monitor job statistics, workflow status distributions, teams, clients, reports, and analytics.

Client Notifications: Receive job activity updates and manage read/unread notifications.

Email Notifications: Optional SMTP-based notifications for job creation, technician assignment, and status changes.

GraphQL API: Centralized API for frontend operations and potential integration with other clients.

Responsive Interface: Responsive layouts, protected routes, charts, loading and empty states, and light/dark theme support.

Technology Stack

Layer

Technologies

Frontend

React 18, Vite, React Router

Styling

Tailwind CSS

API Client

Apollo Client, GraphQL

Backend

Node.js, Express 5, Apollo Server 5

API

GraphQL

Database

MongoDB, Mongoose

Authentication

JSON Web Tokens (JWT), bcryptjs

Visualization

Recharts

Icons

Lucide React

Email

Nodemailer

Development

npm, Nodemon

Architecture

fieldsync/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── graphql/      # Schemas, type definitions, resolvers
│   │   ├── middleware/   # Authentication and authorization
│   │   ├── models/       # User, Job, Notification models
│   │   ├── services/     # Business logic and email services
│   │   └── utils/        # Tokens, validation, formatting
│   └── docs/             # Backend and API documentation
├── frontendui/
│   └── src/
│       ├── admin/        # Administrative workspace
│       ├── technician/   # Technician workspace
│       ├── pages/        # Authentication and public pages
│       ├── routes/       # Protected and role-based routes
│       ├── services/     # Apollo and API clients
│       └── shared/       # Reusable components and utilities
├── database/             # Migration and seed placeholders
└── docs/                 # Integration, requirements, QA

Getting Started

Prerequisites

Node.js 18 or newer

npm

MongoDB running locally or a MongoDB Atlas connection string

1. Clone the repository

git clone https://github.com/princequid/fieldsync.git
cd fieldsync

2. Set up the backend

cd backend
npm install
cp .env.example .env

Configure the environment variables in backend/.env:

MONGO_URI=mongodb://localhost:27017/fieldsync
JWT_SECRET=replace_with_a_secure_secret
PORT=5000

Start the backend in development mode:

npm run dev

For a standard production-style start:

npm start

The GraphQL endpoint is available at:

http://localhost:5000/graphql

3. Set up the frontend

Open a second terminal from the repository root:

cd frontendui
npm install

Create frontendui/.env and configure the backend URL:

VITE_API_URL=http://localhost:5000

Start the frontend:

npm run dev

Open the local URL displayed by Vite in your browser.

4. Build for production

From the frontendui directory:

npm run build

To preview the production build locally:

npm run preview

User Roles

Role

Responsibilities

Administrator

Manage users, create and assign jobs, reassign or cancel work, verify completed jobs, and monitor operational metrics.

Technician

View assigned jobs, start work, update job progress, and submit completion details.

Client

Access client-facing job updates and receive notifications about job progress.

Job Workflow

FieldSync organizes jobs around a controlled workflow:

PENDING
   ↓
IN_PROGRESS
   ↓
COMPLETED
   ↓
VERIFIED

Jobs can also be cancelled when necessary.

Pending: A job has been created and is awaiting work.

In Progress: A technician is actively working on the job.

Completed: The technician has submitted the work for review.

Verified: An administrator has reviewed and approved the completed work.

Cancelled: A job has been cancelled by an authorized administrator.

Administrators can reject submitted completion details, returning the job to IN_PROGRESS for further work.

GraphQL API

FieldSync exposes its API at /graphql.

Queries

Query

Purpose

me

Retrieve the authenticated user.

users(role)

List users, optionally filtered by role.

jobs(status)

List jobs, optionally filtered by status.

jobStats

Retrieve job totals by workflow status.

notifications

Retrieve notifications for the authenticated user.

Mutations

The API supports the following operations:

Authentication: register, login

User management: createTechnician, changePassword

Job management: createJob, updateJobStatus, cancelJob, reassignJob, rejectJobCompletion

Notifications: markNotificationRead, markAllNotificationsRead

The exact permissions and input requirements for each operation are defined by the backend's GraphQL schema and resolvers.

Email Notifications

Email delivery is optional. When SMTP credentials are not configured, the application logs a warning and continues without sending email.

Add the following settings to backend/.env if email delivery is required:

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=FieldSync <no-reply@example.com>

Replace the example values with credentials from your email provider.

Documentation

Additional project documentation is available in the repository:

Backend Documentation

Authentication

Database Models

GraphQL API

Workflow System

Frontend Integration

Deployment and Security

Frontend–Backend Connection Guide

System QA Documentation

Security Considerations

Never commit .env files, JWT secrets, database credentials, or SMTP credentials.

Use a strong, unique JWT_SECRET in deployed environments.

Restrict database network access to trusted services.

Configure HTTPS and appropriate CORS policies before deployment.

Enforce role-based authorization on the backend, not just in the frontend.

Review authentication, session handling, and input validation before production deployment.

