# How the Login Page Was Created

Purpose

- Document how the frontend login page was implemented and how it connects to the backend.

Overview

- The login UI is a small React form that collects email and password, passes them to the app auth layer, and navigates the user based on their role. The current implementation uses a mock `AuthContext` for local development; the form can be wired to the real backend by replacing the mock login with an API call.

Key files

- [frontendui/src/components/forms/LoginForm.jsx](frontendui/src/components/forms/LoginForm.jsx)
- [frontendui/src/pages/auth/Login.jsx](frontendui/src/pages/auth/Login.jsx)
- [frontendui/src/shared/context/AuthContext.jsx](frontendui/src/shared/context/AuthContext.jsx)
- [frontendui/src/services/authService.js](frontendui/src/services/authService.js)
- [backend/routes/authRoutes.js](backend/routes/authRoutes.js)
- [backend/controllers/authController.js](backend/controllers/authController.js)

Implementation details

1. UI

- `LoginForm.jsx` uses React `useState` to manage `email` and `password` fields and simple validation.
- On submit it calls `useAuth().login({ email, password })` from the app `AuthContext`.
- The form shows loading state and error messages from the auth layer.

2. Auth flow (current mock)

- `AuthContext.jsx` exposes a `login` function that checks credentials against `MOCK_CREDENTIALS` and, on success, writes the `user` object to `localStorage` and updates context state.
- After login the component navigates to role-specific routes (admin vs technician).

3. Service layer (how to wire to backend)

- `authService.js` contains a helper to POST to `/api/auth/login`. To connect to a real backend:
  - Ensure `authService.login` sends JSON with `Content-Type: application/json` and handles JSON responses.
  - Update `AuthContext.login` to call `authService.login(email, password)` instead of using mocks.
  - On success, store the returned `token` (e.g., in `localStorage`) and user info; include the token in subsequent requests using an `Authorization: Bearer <token>` header.

4. Backend endpoint

- Backend should implement `POST /api/auth/login` that accepts `{ email, password }` and returns `{ token, user }` on success or a 401 on failure. See [backend/controllers/authController.js](backend/controllers/authController.js).

Dev server / proxy notes

- While developing with Vite, add a dev proxy so frontend calls to `/api` are forwarded to the backend. For example, in `frontendui/vite.config.js` or `package.json` dev server config:

```js
// vite.config.js (devServer proxy example)
export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
```

Quick run commands

```bash
cd frontendui
npm install
npm run dev
# In another terminal:
cd backend
npm install
node server.js
```

Recommended minimal code changes to switch from mock to backend

1. Update `frontendui/src/services/authService.js` to set headers and return parsed JSON.
2. Replace the mock logic in `AuthContext.login` with an async call to `authService.login` and handle success/failure.
3. Add token handling (store token, set `Authorization` on the API helper, and refresh user state on app start if token present).

Notes

- The current implementation purposely used a mock `AuthContext` to allow fast UI iteration without backend dependencies.
- This document focuses on the high-level flow; for exact code snippets, see the files linked above.
