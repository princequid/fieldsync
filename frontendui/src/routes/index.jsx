import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import FirstLogin from "../pages/FirstLogin";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";
import { adminRouteTree } from "./adminRoutes";

import ProtectedRoute from "../shared/components/ProtectedRoute";
import TechnicianLayout from "../technician/layouts/TechnicianLayout";
import TechJobs from "../technician/pages/Jobs";
import TechJobDetail from "../technician/pages/JobDetail";
import StartJob from "../technician/pages/StartJob";
import CompleteJob from "../technician/pages/CompleteJob";
import TechProfile from "../technician/pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/first-login" element={<FirstLogin />} />
      <Route path="/403" element={<Forbidden />} />

      {adminRouteTree}

      <Route
        path="/tech"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="jobs" replace />} />
        <Route path="jobs" element={<TechJobs />} />
        <Route path="jobs/:id" element={<TechJobDetail />} />
        <Route path="jobs/:id/start" element={<StartJob />} />
        <Route path="jobs/:id/complete" element={<CompleteJob />} />
        <Route path="profile" element={<TechProfile />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
