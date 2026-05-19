import { createContext, useContext, useState } from "react";
import { getUserById } from "../utils/mockData";

const MOCK_CREDENTIALS = [
  {
    email: "akosua@swiftfix.com",
    password: "admin123",
    userId: "user-1",
    role: "ADMIN",
  },
  {
    email: "kwame@swiftfix.com",
    password: "tech123",
    userId: "user-2",
    role: "TECHNICIAN",
  },
  {
    email: "ama@swiftfix.com",
    password: "tech123",
    userId: "user-3",
    role: "TECHNICIAN",
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fieldsync_user");
    return stored ? JSON.parse(stored) : null;
  });

  function login(email, password) {
    // TODO: replace with Apollo useMutation(LOGIN) once backend is ready
    const match = MOCK_CREDENTIALS.find(
      (c) => c.email === email && c.password === password,
    );
    if (!match) {
      throw new Error("Invalid email or password.");
    }
    const profile = getUserById(match.userId);
    const userData = {
      id: match.userId,
      email: match.email,
      role: match.role,
      name: profile?.name,
      initials: profile?.initials,
    };
    localStorage.setItem("fieldsync_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem("fieldsync_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
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
