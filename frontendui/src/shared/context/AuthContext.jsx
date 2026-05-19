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

const PASSWORDS_KEY = "fieldsync_passwords";

const AuthContext = createContext(null);

function readPasswordOverrides() {
  try {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePasswordOverride(email, password) {
  const overrides = readPasswordOverrides();
  overrides[email.toLowerCase()] = password;
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(overrides));
}

function resolvePassword(email) {
  const overrides = readPasswordOverrides();
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase(),
  );
  if (!match) return null;
  return overrides[email.toLowerCase()] ?? match.password;
}

function buildUserData(credential) {
  const profile = getUserById(credential.userId);
  return {
    id: credential.userId,
    email: credential.email,
    role: credential.role,
    name: profile?.name,
    initials: profile?.initials,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fieldsync_user");
    return stored ? JSON.parse(stored) : null;
  });

  function persistUser(userData) {
    localStorage.setItem("fieldsync_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  function login(email, password) {
    // TODO: replace with Apollo useMutation(LOGIN) once backend is ready
    const credential = MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    if (!credential) {
      throw new Error("Invalid email or password.");
    }
    const expected = resolvePassword(email);
    if (password !== expected) {
      throw new Error("Invalid email or password.");
    }
    return persistUser(buildUserData(credential));
  }

  function activateFirstLogin(token, email, password) {
    // TODO: replace with Apollo useMutation(ACTIVATE_FIRST_LOGIN) once backend is ready
    if (!token?.trim()) {
      throw new Error("This invitation link is invalid or has expired.");
    }

    const credential = MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    if (!credential || credential.role !== "TECHNICIAN") {
      throw new Error("Unable to activate this account.");
    }

    writePasswordOverride(email, password);
    return persistUser(buildUserData(credential));
  }

  function logout() {
    localStorage.removeItem("fieldsync_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, activateFirstLogin, isAuthenticated: !!user }}
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
