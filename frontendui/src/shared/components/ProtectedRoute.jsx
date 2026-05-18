import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles: ["ADMIN"] or ["TECHNICIAN"] or ["ADMIN", "TECHNICIAN"]
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
