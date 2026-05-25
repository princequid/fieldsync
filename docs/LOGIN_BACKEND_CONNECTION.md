# Login to Backend Connection Guide

This guide explains how the frontend login screen connects to the backend login route in this repo.
It is intentionally limited to authentication login only.

## Current Login Path

- Frontend login helper: `frontendui/src/services/authService.js`
- Backend login route: `backend/routes/authRoutes.js`
- Backend controller: `backend/controllers/authController.js`
- Login endpoint: `POST /api/auth/login`

## How The Login Request Should Flow

1. The login page collects the user's email and password.
2. The frontend calls the login helper in `frontendui/src/services/authService.js`.
3. That helper sends a `POST` request to `/api/auth/login`.
4. The backend route in `backend/routes/authRoutes.js` sends the request to `authController.login`.
5. The controller validates the credentials and returns a response.
6. The frontend stores the authenticated user data and redirects to the technician or admin area.

## Recommended Frontend Login Request

The current helper sends raw JSON without headers. It should be shaped like this:

```js
export const login = async (credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};
```

## Recommended Backend Login Route

The backend already exposes the login route in `backend/routes/authRoutes.js`:

```js
router.post("/login", controller.login);
```

That means the frontend only needs to call:

```txt
POST /api/auth/login
```

## Example Backend Login Response

A login endpoint usually returns something like this:

```json
{
  "user": {
    "id": "user-2",
    "name": "Kwame Asante",
    "role": "TECHNICIAN"
  },
  "token": "jwt-token-here"
}
```

The frontend can then save the token and user info in the auth context or local storage.

## If You Need Proxying In Development

If the frontend is running on Vite and the backend is running separately, add a proxy in `frontendui/vite.config.js` so `/api` requests go to the backend server.

Example:

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

## What To Check If Login Fails

- Confirm the backend is running on port `5000`
- Confirm the frontend login helper uses `/api/auth/login`
- Confirm the request includes `Content-Type: application/json`
- Confirm the backend controller returns JSON
- Confirm the frontend auth context stores the login result correctly

## Repo Notes

- `backend/controllers/authController.js` is currently a placeholder.
- `frontendui/src/services/authService.js` should be updated to send JSON headers and handle the JSON response.
- The route structure already supports login through `POST /api/auth/login`.

If you want, I can also update the actual login service file next so it matches this guide.
