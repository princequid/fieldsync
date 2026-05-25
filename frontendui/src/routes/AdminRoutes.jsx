import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import AdminLayout from "../admin/layouts/AdminLayout";
import { lazyRoute } from "./lazyRoute";
import {
  LazyDashboard,
  LazyAllJobs,
  LazyNewJob,
  LazyJobDetail,
  LazyTeamManagement,
  LazyClients,
  LazyAnalytics,
} from "./lazyPages";
import {
  DashboardPageSkeleton,
  AllJobsPageSkeleton,
  NewJobPageSkeleton,
  JobDetailPageSkeleton,
  TeamPageSkeleton,
  ClientsPageSkeleton,
  AnalyticsPageSkeleton,
} from "../shared/components/skeletons/PageSkeletons";

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
    <Route
      path="dashboard"
      element={lazyRoute(LazyDashboard, DashboardPageSkeleton)}
    />
    <Route path="jobs" element={lazyRoute(LazyAllJobs, AllJobsPageSkeleton)} />
    <Route path="jobs/new" element={lazyRoute(LazyNewJob, NewJobPageSkeleton)} />
    <Route
      path="jobs/:id"
      element={lazyRoute(LazyJobDetail, JobDetailPageSkeleton)}
    />
    <Route path="team" element={lazyRoute(LazyTeamManagement, TeamPageSkeleton)} />
    <Route path="clients" element={lazyRoute(LazyClients, ClientsPageSkeleton)} />
    <Route
      path="analytics"
      element={lazyRoute(LazyAnalytics, AnalyticsPageSkeleton)}
    />
  </Route>
);
