# GraphQL API Documentation

## Base URL
http://localhost:5000/graphql

---

## Authentication

### Register
mutation register()

### Login
mutation login()

---

## Queries

### me
Returns current user

### users (Admin only)
Returns all users

### jobs
Returns jobs based on role

### notifications
Returns user notifications

---

## Mutations

### createJob (Admin)
Creates a job

### updateJobStatus
Updates job workflow