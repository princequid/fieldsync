# FieldSync

FieldSync is a field operations management platform for coordinating clients, technicians, and administrators from job creation through verification.

The project includes a React-based web application and a Node.js GraphQL backend. Administrators can manage users and jobs, technicians can work through assigned jobs, and clients can receive job and status notifications.

## Features

- **Role-based access** for administrators, technicians, and clients
- **JWT authentication** with password hashing via `bcryptjs`
- **Job management** with titles, descriptions, locations, priorities, assignments, and completion notes
- **Controlled job workflow**: `PENDING` → `IN_PROGRESS` → `COMPLETED` → `VERIFIED`
- **Job administration** including reassignment, cancellation, completion rejection, and verification
- **Technician workspace** for viewing assigned jobs, starting work, and completing jobs
- **Admin dashboard** with job statistics, status distribution, team management, clients, reports, and analytics views
- **Client notifications** for job activity and read/unread notification management
- **Optional email notifications** for job creation, technician assignment, and status changes
- **Responsive UI** with protected routes, loading states, empty states, charts, and light/dark theme support
- **GraphQL API** shared by the frontend and other clients

## Architecture

```text
fieldsync/
├── backend/       Express + Apollo GraphQL API
│   ├── src/
│   │   ├── config/       MongoDB connection
│   │   ├── graphql/      Schemas, type definitions, and resolvers
│   │   ├── middleware/   Authentication and role authorization
│   │   ├── models/       User, Job, and Notification models
│   │   ├── services/     Authentication, jobs, notifications, and email
│   │   └── utils/        Tokens, validation, and formatting helpers
│   └── docs/        Backend architecture and API notes
├── frontendui/     React + Vite web application
│   └── src/
│       ├── admin/        Admin layouts, pages, components, and data hooks
│       ├── technician/   Technician layouts, pages, components, and data hooks
│       ├── pages/        Authentication and public pages
│       ├── routes/       Protected and role-specific routes
│       ├── services/     Apollo and API clients
│       └── shared/       Reusable UI, context, hooks, and utilities
├── database/       Database migration and seed placeholders
└── docs/           Integration, requirements, and QA documentation
```

## Technology Stack

### Frontend

- React 18
- Vite
- React Router
- Apollo Client and GraphQL
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Node.js
- Express 5
- Apollo Server 5
- GraphQL
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- Nodemailer for optional email delivery

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/princequid/fieldsync.git
cd fieldsync
```

### 2. Configure and run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your local MongoDB connection and a secure JWT secret:

```env
MONGO_URI=mongodb://localhost:27017/fieldsync
JWT_SECRET=replace_with_a_secure_secret
PORT=5000
```

Start the API in development mode:

```bash
npm run dev
```

The GraphQL endpoint is available at:

```text
http://localhost:5000/graphql
```

To run the backend without Nodemon:

```bash
npm start
```

### 3. Configure and run the frontend

Open a second terminal:

```bash
cd frontendui
npm install
```

For local development with the backend on port `5000`, create `frontendui/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

Use the local URL printed by Vite to open the application.

Create a production build with:

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Authentication and Roles

FieldSync supports three roles:

| Role | Responsibilities |
| --- | --- |
| **ADMIN** | Manage users, create and assign jobs, reassign or cancel work, verify completed jobs, and view operational metrics |
| **TECHNICIAN** | View assigned jobs, move jobs into progress, complete work, and submit completion details |
| **CLIENT** | View client-facing job updates and receive notifications about job progress |

Authentication returns a JWT. The frontend stores the token for the current session and sends it with GraphQL requests.

## Job Workflow

```text
PENDING → IN_PROGRESS → COMPLETED → VERIFIED
                  ↘
                CANCELLED
```

Technicians can start pending jobs and mark active jobs as completed. Administrators verify completed work. Administrators can also reject a completion, returning the job to `IN_PROGRESS`, or cancel a job when required.

## GraphQL API

The API is exposed at `/graphql` and includes:

### Queries

- `me` — return the authenticated user
- `users(role)` — list users, optionally filtered by role
- `jobs(status)` — list jobs, optionally filtered by status
- `jobStats` — return job totals by workflow status
- `notifications` — return notifications for the current user

### Mutations

- `register` and `login`
- `createTechnician` and `changePassword`
- `createJob`
- `updateJobStatus`
- `cancelJob`
- `reassignJob`
- `rejectJobCompletion`
- `markNotificationRead`
- `markAllNotificationsRead`

Apollo Server also provides an interactive GraphQL environment when the backend is running locally.

## Email Notifications

Email delivery is optional. If SMTP variables are not configured, FieldSync logs a warning and continues without sending email.

Add these settings to `backend/.env` when email notifications are needed:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=FieldSync <no-reply@example.com>
```

## Documentation

- [Backend documentation](backend/docs/README.md)
- [Authentication](backend/docs/03-authentication.md)
- [Database models](backend/docs/04-database-models.md)
- [GraphQL API notes](backend/docs/05-graphql-api.md)
- [Workflow system](backend/docs/06-workflow-system.md)
- [Frontend integration](backend/docs/07-frontend-integration.md)
- [Deployment and security](backend/docs/08-deployment-security.md)
- [Frontend/backend connection guide](docs/FRONTEND_BACKEND_CONNECTION.md)
- [System QA documentation](docs/SYSTEM_QA_DOCUMENTATION.md)

## Security Notes

- Never commit `.env` files, JWT secrets, database credentials, or SMTP credentials.
- Use a strong, unique `JWT_SECRET` outside local development.
- Restrict MongoDB network access in hosted environments.
- Configure CORS and HTTPS appropriately before deploying to production.

## License

This project currently does not declare a public open-source license.
