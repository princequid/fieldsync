import { Link, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, User } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";

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

export default function TechnicianLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const techData = useTechnicianData(user?.id);
  const userData = getUserById(user?.id);
  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen flex-col">
      {/* Top nav — dark green */}
      <header
        className="flex shrink-0 items-center justify-between px-4"
        style={{ backgroundColor: "#1a2e1a", minHeight: "56px" }}
      >
        <div className="w-10" />
        <h1 className="text-base font-semibold text-white">{title}</h1>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: "#27AE60" }}
        >
          {userData?.initials ?? "T"}
        </div>
      </header>

      {/* Page content — scrollable */}
      <main className="flex-1 overflow-y-auto bg-[#f5f2ee]">
        <Outlet context={techData} />
      </main>

      {/* Bottom tab bar */}
      <nav className="shrink-0 border-t border-slate-200 bg-white">
        <div className="flex">
          {TABS.map(({ path, label, Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
                style={{ minHeight: "56px" }}
              >
                <Icon
                  size={22}
                  className={isActive ? "text-[#27AE60]" : "text-gray-400"}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-[#27AE60]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-[#27AE60]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
