# Technician Page to Backend Connection Guide

This guide explains how the technician pages in this repo should connect to the backend.
It is limited to technician screens such as the jobs list, job detail, start job, complete job, and technician report submission.

## Current Technician Frontend Entry Points

- Technician data provider: `frontendui/src/technician/hooks/useTechnicianData.jsx`
- Technician layout shell: `frontendui/src/technician/layouts/TechnicianLayout.jsx`
- Shared report service: `frontendui/src/services/reportService.js`
- Backend report route: `backend/routes/reportRoutes.js`
- Backend report controller: `backend/controllers/reportController.js`

## Current Technician Data Flow

The technician page currently loads mock data from `frontendui/src/shared/utils/mockData` through `useTechnicianData.jsx`.
The technician UI should connect to backend endpoints for:

1. Loading the signed-in technician's jobs.
2. Loading a single job by ID for the detail page.
3. Updating job status from the detail/start/complete flows.
4. Submitting the completion report note.
5. Refreshing the technician job list after changes.

## Recommended Backend Endpoints

A simple REST structure for the technician pages would be:

- `GET /api/technician/jobs`
- `GET /api/technician/jobs/:id`
- `PATCH /api/technician/jobs/:id/start`
- `PATCH /api/technician/jobs/:id/complete`
- `PATCH /api/technician/jobs/:id/status`
- `POST /api/reports`
- `GET /api/reports/:jobId`

## Recommended Frontend Request Pattern

Use the shared API helper in `frontendui/src/services/api.js` so all technician requests go through `/api`.

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

## Recommended Technician Hook Flow

The current `useTechnicianData.jsx` hook uses mock jobs.
A backend-connected version should fetch the current technician's jobs from the API.

Example:

```js
const refetch = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await api(`/technician/jobs?technicianId=${technicianId}`);
    setJobs(data.jobs);
  } catch (err) {
    setError(err.message || "Unable to load your jobs.");
  } finally {
    setLoading(false);
  }
};
```

## Job Status Updates

The technician UI has actions for:

- starting a job
- completing a job
- submitting completion notes

Those actions should call backend endpoints such as:

- `PATCH /api/technician/jobs/:id/start`
- `PATCH /api/technician/jobs/:id/complete`
- `PATCH /api/technician/jobs/:id/status`

A typical request could look like this:

```js
await api(`/technician/jobs/${jobId}/complete`, {
  method: "PATCH",
  body: {
    note,
  },
});
```

## Report Submission

The current `frontendui/src/services/reportService.js` posts to `/api/reports`.
That is a good fit for the complete job flow.

Example:

```js
import { api } from "./api";

export const submitReport = (data) =>
  api("/reports", {
    method: "POST",
    body: data,
  });
```

## Backend Route Setup

The backend currently has `backend/routes/reportRoutes.js` mounted for reports.
To support the technician page properly, the backend should also mount technician job routes.

Example:

```js
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/technician", require("./routes/technicianRoutes"));
```

Then the backend controller can return:

- the technician's assigned jobs
- the job detail for a specific job
- status updates for start/complete actions
- completion report payloads

## Development Proxy

If the frontend runs separately from the backend, keep the Vite proxy pointed at the backend server.

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

## What To Check If The Technician Page Fails

- Confirm the backend is running on port `5000`
- Confirm `useTechnicianData.jsx` no longer reads only from mock data
- Confirm the jobs list calls a backend endpoint like `/api/technician/jobs`
- Confirm job detail and complete actions return JSON
- Confirm `/api/reports` accepts the technician completion payload
- Confirm the frontend handles loading and error states

## Repo Notes

- `frontendui/src/technician/hooks/useTechnicianData.jsx` is still mock-data based.
- `frontendui/src/services/reportService.js` already points at `/api/reports`.
- `backend/controllers/reportController.js` is still a placeholder.
- The technician page does not yet have live backend wiring, so the guide above is the recommended connection pattern.

If you want, I can next update the technician hook and report service to use this flow.
