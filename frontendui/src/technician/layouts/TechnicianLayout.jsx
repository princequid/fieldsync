import { Link, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, User } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import {
  TechnicianDataProvider,
  useTechnicianData,
} from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import TechNavbar from "../components/TechNavbar";
import PageTransitionWrapper from "../../shared/components/PageTransitionWrapper";
import {
  GenericPageSkeleton,
  TechJobsPageSkeleton,
} from "../../shared/components/skeletons/PageSkeletons";

const TABS = [
  { path: "/tech/jobs", label: "My Jobs", Icon: ClipboardList },
  { path: "/tech/profile", label: "Profile", Icon: User },
];

const HEADER_HEIGHT = "clamp(54px, 12vw, 60px)";
const TAB_BAR_BASE_HEIGHT = "clamp(60px, 14vw, 68px)";

function getPageTitle(pathname) {
  if (pathname.endsWith("/profile")) return "Profile";
  if (pathname.endsWith("/start")) return "Start Job";
  if (pathname.endsWith("/complete")) return "Complete Job";
  if (/\/tech\/jobs\/[^/]+$/.test(pathname)) return "Job Details";
  return "My Jobs";
}

function isTabActive(pathname, path) {
  if (path === "/tech/profile") return pathname === "/tech/profile";
  return pathname === "/tech" || pathname.startsWith("/tech/jobs");
}

export default function TechnicianLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const userData = getUserById(user?.id);
  const title = getPageTitle(location.pathname);

  return (
    <TechnicianDataProvider technicianId={user?.id}>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F0EDE8] dark:bg-gray-950">
        {/* Top navbar */}
        <TechNavbar pageTitle={title} />

        {/* Main scroll area */}
        <TechMainContent transitionKey={location.key} />

        {/* Bottom navigation rendered inside provider via NavTabs */}
        <NavTabs currentPath={location.pathname} />
      </div>
    </TechnicianDataProvider>
  );
}

function NavTabs({ currentPath }) {
  const { jobs } = useTechnicianData();

  const activeJobCount = (jobs || []).filter(
    (job) => job.status === "PENDING" || job.status === "IN_PROGRESS",
  ).length;

  return (
    <nav
      className="shrink-0 bg-white dark:bg-gray-900 dark:border-gray-800"
      style={{
        height: `calc(${TAB_BAR_BASE_HEIGHT} + env(safe-area-inset-bottom))`,
        borderTop: "1px solid #F1F5F9",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxSizing: "border-box",
        boxShadow: "0 -1px 0 rgba(0,0,0,0.04), 0 -4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex h-full">
        {TABS.map(({ path, label, Icon }) => {
          const active = isTabActive(currentPath, path);
          const countLabel = path === "/tech/jobs" ? activeJobCount : "1";
          return (
            <Link
              key={path}
              to={path}
              className="fs-focus-ring w-1/2 flex h-full min-h-11 flex-col items-center justify-center gap-0.5 px-1 transition-all duration-150 ease-in-out"
            >
              <span className="flex flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-1.5">
                <span
                  className={`font-medium transition-colors duration-150 ${
                    active ? "text-[#2E86AB]" : "text-[#94A3B8] dark:text-gray-600"
                  }`}
                  style={{
                    fontSize: "clamp(9px, 2.6vw, 11px)",
                    lineHeight: 1,
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
                <span
                  className={`inline-flex items-center justify-center rounded-badge px-2 py-0.5 text-[10px] font-semibold transition-colors duration-150 ${
                    active
                      ? "bg-[rgba(46,134,171,0.12)] text-[#2E86AB]"
                      : "bg-[#F1F5F9] text-[#64748B] dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {countLabel}
                </span>
              </span>
              <span
                className={`flex items-center justify-center rounded-[9px] transition-colors duration-150 ${
                  active ? "bg-[rgba(46,134,171,0.12)]" : ""
                }`}
                style={{
                  width: "clamp(30px, 8vw, 36px)",
                  height: "clamp(30px, 8vw, 36px)",
                }}
              >
                <Icon
                  size={18}
                  className={
                    active ? "text-[#2E86AB]" : "text-[#94A3B8] dark:text-gray-600"
                  }
                />
              </span>
              {active && (
                <span style={{ height: 3, width: 16 }} className="mt-1 rounded-full bg-[#2E86AB] mx-auto" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TechMainContent({ transitionKey }) {
  const location = useLocation();
  const { loading, error, refetch } = useTechnicianData();

  return (
    <main
      className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
      style={{
        paddingBottom:
          "calc(clamp(60px, 14vw, 68px) + env(safe-area-inset-bottom) + 8px)",
      }}
    >
      <AsyncPageContent
        loading={loading}
        error={error}
        thing="jobs"
        onRetry={refetch}
        skeleton={() => {
          const pathname = location.pathname;
          return pathname === "/tech" || pathname.startsWith("/tech/jobs") ? (
            <TechJobsPageSkeleton />
          ) : (
            <GenericPageSkeleton className="px-3 py-4" />
          );
        }}
        className="min-h-[40vh]"
      >
        <PageTransitionWrapper transitionKey={transitionKey}>
          <Outlet />
        </PageTransitionWrapper>
      </AsyncPageContent>
    </main>
  );
}
