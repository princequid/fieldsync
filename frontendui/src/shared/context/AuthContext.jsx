import { createContext, useContext, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { CHANGE_PASSWORD_MUTATION } from "../../graphql/operations";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const apolloClient = useApolloClient();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fieldsync_user");
    return stored ? JSON.parse(stored) : null;
  });

  function persistUser(userData) {
    localStorage.setItem("fieldsync_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  async function login(email, password) {
    const query = `mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id name email phone role mustChangePassword }
      }
    }`;

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${apiUrl}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { email, password } }),
    });

    const json = await res.json();

    if (json.errors?.length) {
      throw new Error(json.errors[0].message || "Login failed");
    }

    const payload = json.data?.login;
    if (!payload) throw new Error("Invalid login response");

    const { token, user: u } = payload;
    if (token) localStorage.setItem("fieldsync_token", token);

    return persistUser({
      id: u.id,
      email: u.email,
      phone: u.phone ?? null,
      role: u.role,
      name: u.name,
      mustChangePassword: !!u.mustChangePassword,
    });
  }

  async function changePassword(currentPassword, newPassword) {
    const { data, errors } = await apolloClient.mutate({
      mutation: CHANGE_PASSWORD_MUTATION,
      variables: { currentPassword, newPassword },
    });

    if (errors?.length) {
      throw new Error(errors[0].message || "Failed to change password");
    }

    const payload = data?.changePassword;
    if (!payload) throw new Error("Invalid response from server");

    const { token, user: u } = payload;
    if (token) localStorage.setItem("fieldsync_token", token);

    return persistUser({
      id: u.id,
      email: u.email,
      phone: u.phone ?? null,
      role: u.role,
      name: u.name,
      mustChangePassword: !!u.mustChangePassword,
    });
  }

  async function activateFirstLogin(token, email, password) {
    if (!token?.trim()) {
      throw new Error("This invitation link is invalid or has expired.");
    }
    throw new Error("Account activation must be done through the backend.");
  }

  function logout() {
    localStorage.removeItem("fieldsync_user");
    localStorage.removeItem("fieldsync_token");
    setUser(null);
    apolloClient.clearStore();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        changePassword,
        activateFirstLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
