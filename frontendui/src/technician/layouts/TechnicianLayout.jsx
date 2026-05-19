import { Link, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, User } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import {
  TechnicianDataProvider,
  useTechnicianData,
} from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import Loader from "../../shared/components/Loader";
import ErrorState from "../../shared/components/ErrorState";

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
  if (path === "/tech/profile") {
    return pathname === "/tech/profile";
  }
  return pathname === "/tech" || pathname.startsWith("/tech/jobs");
}

export default function TechnicianLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const userData = getUserById(user?.id);
  const title = getPageTitle(location.pathname);

  return (
    <TechnicianDataProvider technicianId={user?.id}>
      <div className="flex h-screen flex-col overflow-hidden bg-[#f5f2ee]">
        <header className="fs-tech-header flex shrink-0 items-center justify-between px-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] min-h-14">
          <div className="w-10 shrink-0" aria-hidden />
          <h1 className="text-base font-bold text-white">{title}</h1>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/30 text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: "#27AE60" }}
            aria-hidden
          >
            {userData?.initials ?? "T"}
          </div>
        </header>

        <TechMainContent />

        <nav
          className="shrink-0 border-t border-slate-200 bg-white"
          style={{ boxShadow: "0 -1px 8px rgba(0,0,0,0.06)" }}
        >
          <div className="flex">
            {TABS.map(({ path, label, Icon }) => {
              const active = isTabActive(location.pathname, path);
              return (
                <Link
                  key={path}
                  to={path}
                  className="fs-focus-ring flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-14"
                >
                  <span
                    className={`flex h-8 w-10 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-[#27AE60]/15" : ""
                    }`}
                  >
                    <Icon
                      size={22}
                      className={active ? "text-[#27AE60]" : "text-gray-400"}
                    />
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-[#27AE60]" : "text-gray-400"
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

function TechMainContent() {
  const { loading, error, refetch } = useTechnicianData();

  return (
    <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[72px]">
      {loading ? (
        <Loader centered />
      ) : error ? (
        <ErrorState thing="jobs" message={error} onRetry={refetch} />
      ) : (
        <div className="fs-page-enter">
          <Outlet />
        </div>
      )}
    </main>
  );
}
