import { lazy } from "react";

/* Admin pages — code-split per route */
export const LazyDashboard = lazy(() => import("../admin/pages/Dashboard"));
export const LazyAllJobs = lazy(() => import("../admin/pages/AllJobs"));
export const LazyNewJob = lazy(() => import("../admin/pages/NewJob"));
export const LazyJobDetail = lazy(() => import("../admin/pages/JobDetail"));
export const LazyTeamManagement = lazy(
  () => import("../admin/pages/TeamManagement"),
);
export const LazyClients = lazy(() => import("../admin/pages/Clients"));
export const LazyAnalytics = lazy(() => import("../admin/pages/Analytics"));

/* Technician pages */
export const LazyTechJobs = lazy(() => import("../technician/pages/Jobs"));
export const LazyTechJobDetail = lazy(
  () => import("../technician/pages/JobDetail"),
);
export const LazyStartJob = lazy(() => import("../technician/pages/StartJob"));
export const LazyCompleteJob = lazy(
  () => import("../technician/pages/CompleteJob"),
);
export const LazyTechProfile = lazy(
  () => import("../technician/pages/Profile"),
);

/* Auth / utility */
export const LazyLogin = lazy(() => import("../pages/Login"));
export const LazyForgotPassword = lazy(
  () => import("../pages/ForgotPassword"),
);
export const LazyFirstLogin = lazy(() => import("../pages/FirstLogin"));
