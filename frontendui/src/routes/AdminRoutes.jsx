import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import AllJobs from "../admin/pages/AllJobs";
import NewJob from "../admin/pages/NewJob";
import JobDetail from "../admin/pages/JobDetail";
import TeamManagement from "../admin/pages/TeamManagement";
import Analytics from "../admin/pages/Analytics";

export const adminRouteTree = (
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
);
