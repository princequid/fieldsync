# Frontend to Backend Connection Guide

This project has a React frontend in `frontendui/` and an Express backend in `backend/`.
The cleanest way to connect them in development is to let Vite proxy API requests to the backend.

## Current Ports

- Frontend: Vite runs on `http://localhost:5173` or `http://localhost:5174`
- Backend: Express runs on `http://localhost:5000`

The backend currently starts from `backend/server.js` and reads its port from `backend/config/env.js`.

## Recommended Setup

### 1. Add a Vite proxy

Update `frontendui/vite.config.js` so frontend requests to `/api` go to the backend server.

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

### 2. Use `/api` in frontend fetch calls

Make all frontend API calls start with `/api`.
That lets Vite forward them to the backend during development.

Example:

```js
export const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};
```

### 3. Call backend routes from services

Use the shared API helper from files like `frontendui/src/services/authService.js`.

Example:

```js
import { api } from "./api";

export const login = (credentials) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
```

### 4. Add backend routes under `/api`

The Express backend should expose routes such as:

- `POST /api/auth/login`
- `GET /api/jobs`
- `GET /api/users/me`

A typical backend server setup looks like this:

```js
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
```

## Environment Variables

If you prefer not to use a proxy, you can set a frontend API base URL instead.

Example `.env` in `frontendui/`:

```env
VITE_API_URL=http://localhost:5000
```

Then use it in the API helper:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};
```

## Why This Works

- The frontend talks to `/api/...` instead of hardcoding backend URLs everywhere.
- Vite forwards those requests to the Express server during development.
- You avoid CORS problems and keep the frontend code simple.
- In production, the same `/api` pattern can be kept behind a reverse proxy or deployment server.

## Quick Checklist

- Start backend on port `5000`
- Start frontend with Vite
- Add the `/api` proxy in `vite.config.js`
- Make frontend requests use `/api`
- Mount backend route handlers under `/api`

## Notes For This Repo

- `backend/server.js` currently only returns a health response at `/`.
- `frontendui/src/services/api.js` is currently a raw `fetch(path)` helper.
- `frontendui/src/services/authService.js` posts to `/api/auth/login` but should send JSON headers and stringify the body.

If you want, I can apply the proxy and API helper changes directly in the code next.
