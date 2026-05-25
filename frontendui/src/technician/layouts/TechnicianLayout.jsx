import { Link, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, User } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import {
  TechnicianDataProvider,
  useTechnicianData,
} from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import ThemeToggle from "../../shared/components/ThemeToggle";
import PageTransitionWrapper from "../../shared/components/PageTransitionWrapper";
import {
  GenericPageSkeleton,
  TechJobsPageSkeleton,
} from "../../shared/components/skeletons/PageSkeletons";

const TABS = [
  { path: "/tech/jobs", label: "My Jobs", Icon: ClipboardList },
  { path: "/tech/profile", label: "Profile", Icon: User },
];

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
      <div className="flex h-screen flex-col overflow-hidden bg-brand-bg dark:bg-gray-950">
        {/* Top header */}
        <header className="fs-tech-header flex h-14 shrink-0 items-center justify-between px-4">
          <div className="w-9 shrink-0" aria-hidden />
          <h1 className="text-center text-[16px] font-semibold text-white">
            {title}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <div
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/25 text-[12px] font-bold text-white"
              style={{ backgroundColor: "#27AE60" }}
              aria-hidden
            >
              {userData?.initials ?? "T"}
            </div>
          </div>
        </header>

        {/* Main scroll area */}
        <TechMainContent transitionKey={location.key} />

        {/* Bottom navigation */}
        <nav
          className="shrink-0 border-t border-transparent bg-white dark:border-gray-800 dark:bg-gray-900"
          style={{
            height: "64px",
            boxShadow: "0 -1px 0 #F1F5F9, 0 -4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex h-full">
            {TABS.map(({ path, label, Icon }) => {
              const active = isTabActive(location.pathname, path);
              return (
                <Link
                  key={path}
                  to={path}
                  className="fs-focus-ring flex h-full flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-150"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors duration-150 ${
                      active ? "bg-[rgba(39,174,96,0.1)]" : ""
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-[#27AE60]" : "text-[#94A3B8] dark:text-gray-600"}
                    />
                  </span>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-150 ${
                      active ? "text-[#27AE60]" : "text-[#94A3B8] dark:text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </TechnicianDataProvider>
  );
}

function TechMainContent({ transitionKey }) {
  const location = useLocation();
  const { loading, error, refetch } = useTechnicianData();

  return (
    <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-3">
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
