import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Login from "../pages/Login";
import FirstLogin from "../pages/FirstLogin";
import ForgotPassword from "../pages/ForgotPassword";

// Admin
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import AllJobs from "../admin/pages/AllJobs";
import NewJob from "../admin/pages/NewJob";
import JobDetail from "../admin/pages/JobDetail";
import TeamManagement from "../admin/pages/TeamManagement";
import Analytics from "../admin/pages/Analytics";

// Technician
import TechnicianLayout from "../technician/layouts/TechnicianLayout";
import TechJobs from "../technician/pages/Jobs";
import TechJobDetail from "../technician/pages/JobDetail";
import StartJob from "../technician/pages/StartJob";
import CompleteJob from "../technician/pages/CompleteJob";
import TechProfile from "../technician/pages/Profile";

import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/first-login" element={<FirstLogin />} />
      <Route path="/403" element={<Forbidden />} />

      {/* Admin routes — wrapped in AdminLayout, protected for ADMIN role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<AllJobs />} />
        <Route path="jobs/new" element={<NewJob />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Technician routes — wrapped in TechnicianLayout, protected for TECHNICIAN role */}
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

      {/* Root redirect based on role — handled by Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
