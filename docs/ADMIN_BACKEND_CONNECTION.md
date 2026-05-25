# Admin Page to Backend Connection Guide

This guide explains how the admin page in this repo should connect to the backend.
It is focused on the admin dashboard and admin actions, not technician flows or login.

## Current Admin Frontend Entry Point

- Admin data hook: `frontendui/src/admin/hooks/useAdminData.jsx`
- Shared API helper: `frontendui/src/services/api.js`
- Backend user route: `backend/routes/userRoutes.js`
- Backend user controller: `backend/controllers/userController.js`

## Current Admin Data Flow

The admin dashboard currently loads mock data from `frontendui/src/shared/utils/mockData`.
To connect it to the backend, replace those mock reads with real API calls.

The admin page should fetch data like this:

1. Load dashboard data from backend endpoints.
2. Fill the admin context with jobs, technicians, clients, and notifications.
3. Call backend actions for verify, reject, cancel, reassign, create job, create client, and add technician.
4. Refresh the dashboard after each mutation when needed.

## Recommended Backend Endpoints

A clean REST shape for the admin page would be:

- `GET /api/admin/dashboard`
- `GET /api/jobs`
- `GET /api/technicians`
- `GET /api/clients`
- `GET /api/notifications`
- `POST /api/jobs`
- `POST /api/clients`
- `POST /api/technicians`
- `PATCH /api/jobs/:id/verify`
- `PATCH /api/jobs/:id/reject`
- `PATCH /api/jobs/:id/cancel`
- `PATCH /api/jobs/:id/reassign`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

## Recommended Frontend Request Pattern

Use the shared API helper in `frontendui/src/services/api.js` so the admin page always talks to `/api`.

Example:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};
```

## Recommended Admin Hook Flow

The current `useAdminData.jsx` hook can be converted from mock data to API calls.
A simple pattern is:

```js
const refetch = async () => {
  setLoading(true);
  setError(null);

  try {
    const dashboard = await api("/admin/dashboard");
    setJobs(dashboard.jobs);
    setTechnicians(dashboard.technicians);
    setClients(dashboard.clients);
    setNotifications(dashboard.notifications);
  } catch (err) {
    setError(err.message || "Unable to load admin data.");
  } finally {
    setLoading(false);
  }
};
```

## Backend Route Setup

The backend currently has `backend/routes/userRoutes.js` and `backend/controllers/userController.js` as placeholders.
A more complete admin backend setup could mount routes like this:

```js
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
```

Then the controller methods can return JSON for the admin dashboard and mutations.

## Development Proxy

If the frontend and backend run separately, keep the Vite proxy pointed at the backend server.

Example `frontendui/vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

## What To Check If The Admin Page Fails

- Confirm the backend is running on port `5000`
- Confirm the admin hook no longer reads only from mock data
- Confirm the frontend calls `/api/admin/dashboard` or equivalent routes
- Confirm the backend returns JSON with jobs, technicians, clients, and notifications
- Confirm the frontend handles loading and error states

## Repo Notes

- `frontendui/src/admin/hooks/useAdminData.jsx` is still mock-data based.
- `backend/controllers/userController.js` currently returns placeholder JSON.
- The admin page does not yet have live backend wiring, so the guide above is the recommended connection pattern.

If you want, I can update the admin hook and add the corresponding backend route sketch next.
