import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/jobs", label: "All Jobs", icon: Briefcase },
  { to: "/admin/jobs/new", label: "New Job", icon: Plus },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = getUserById(user?.id);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col bg-[#1E3A5F] text-white transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2E86AB] text-sm font-bold">
            FS
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold">FieldSync</p>
              <p className="text-[10px] uppercase tracking-wide text-white/60">
                Admin
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2E86AB] text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div
          className={`mb-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2E86AB] text-sm font-bold">
            {profile?.initials ?? "A"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {profile?.name ?? user?.email}
              </p>
              <p className="text-xs text-white/60">Operations Manager</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
