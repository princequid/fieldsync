export const login = (credentials) =>
  fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
