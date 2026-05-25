import { Routes, Route, Navigate } from "react-router-dom";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";
import { adminRouteTree } from "./adminRoutes";
import { lazyRoute } from "./lazyRoute";
import {
  LazyLogin,
  LazyForgotPassword,
  LazyFirstLogin,
  LazyTechJobs,
  LazyTechJobDetail,
  LazyStartJob,
  LazyCompleteJob,
  LazyTechProfile,
} from "./lazyPages";
import {
  AuthPageSkeleton,
  GenericPageSkeleton,
  JobDetailPageSkeleton,
  NewJobPageSkeleton,
  TechJobsPageSkeleton,
} from "../shared/components/skeletons/PageSkeletons";

import ProtectedRoute from "../shared/components/ProtectedRoute";
import TechnicianLayout from "../technician/layouts/TechnicianLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={lazyRoute(LazyLogin, AuthPageSkeleton)} />
      <Route
        path="/forgot-password"
        element={lazyRoute(LazyForgotPassword, AuthPageSkeleton)}
      />
      <Route
        path="/first-login"
        element={lazyRoute(LazyFirstLogin, AuthPageSkeleton)}
      />
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
        <Route
          path="jobs"
          element={lazyRoute(LazyTechJobs, TechJobsPageSkeleton)}
        />
        <Route
          path="jobs/:id"
          element={lazyRoute(LazyTechJobDetail, JobDetailPageSkeleton)}
        />
        <Route
          path="jobs/:id/start"
          element={lazyRoute(LazyStartJob, NewJobPageSkeleton)}
        />
        <Route
          path="jobs/:id/complete"
          element={lazyRoute(LazyCompleteJob, NewJobPageSkeleton)}
        />
        <Route
          path="profile"
          element={lazyRoute(LazyTechProfile, GenericPageSkeleton)}
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
