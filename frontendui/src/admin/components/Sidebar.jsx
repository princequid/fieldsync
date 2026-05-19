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
      className={`fs-sidebar-gradient flex h-screen shrink-0 flex-col text-white transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-5">
        <div
          className={`flex items-center gap-2.5 ${collapsed ? "w-full justify-center" : ""}`}
        >
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-white/10 bg-[#2E86AB] text-sm font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]"
            aria-hidden
          >
            FS
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold leading-tight">FieldSync</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                Admin
              </p>
            </div>
          )}
        </div>
        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="fs-btn-press fs-focus-ring rounded-full border border-transparent p-1.5 text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <div className="flex justify-center px-2 py-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="fs-btn-press fs-focus-ring rounded-full border border-transparent p-1.5 text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              [
                "fs-btn-press fs-focus-ring flex items-center gap-2.5 rounded-xl py-2.5 text-[13px] font-medium transition-colors",
                collapsed ? "justify-center px-2" : "px-3",
                isActive
                  ? "fs-nav-active text-white"
                  : "border-l-[3px] border-transparent text-white/75 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 bg-white/[0.04] p-3">
        <div
          className={`mb-3 flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white/20 bg-[#2E86AB] text-sm font-bold shadow-sm">
            {profile?.initials ?? "A"}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">
                {profile?.name ?? user?.email}
              </p>
              <p className="text-[11px] text-white/60">Operations Manager</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={`fs-btn-press fs-focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white ${
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
