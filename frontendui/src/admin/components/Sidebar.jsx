import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { to: "/admin/jobs", label: "All Jobs", icon: Briefcase },
      { to: "/admin/jobs/new", label: "New Job", icon: Plus },
      { to: "/admin/team", label: "Team", icon: Users },
      { to: "/admin/clients", label: "Clients", icon: Building2 },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
];

/* FS logo gradient */
const LOGO_GRADIENT = "linear-gradient(135deg, #2E86AB 0%, #1A6FA8 100%)";

const TOGGLE_BTN =
  "fs-focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80 transition-all duration-150 hover:border-white/20 hover:bg-white/15 hover:text-white active:scale-95";

export default function Sidebar({
  collapsed = false,
  onCollapsedChange,
  overlay = false,
  onNavigate,
  onCloseOverlay,
  className = "",
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = getUserById(user?.id);

  function setCollapsed(next) {
    onCollapsedChange?.(next);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
    onNavigate?.();
  }

  return (
    <aside
      style={{
        transition: "width 280ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={[
        `fs-sidebar flex h-full shrink-0 flex-col text-white ${
          collapsed ? "w-16" : "w-64"
        }`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Logo header ──────────────────────────────────────── */}
      <div className="flex h-18 shrink-0 items-center justify-between px-6">
        <div
          className={`flex items-center gap-3 ${collapsed ? "w-full justify-center" : ""}`}
        >
          {/* FS mark */}
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[13px] font-bold text-white"
            style={{
              background: LOGO_GRADIENT,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            aria-hidden
          >
            FS
          </div>

          {!collapsed && (
            <div>
              <p
                className="text-[15px] font-semibold leading-tight text-white"
                style={{ letterSpacing: "-0.3px" }}
              >
                FieldSync
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                Operations Platform
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={() => {
              if (overlay) {
                onCloseOverlay?.();
                return;
              }
              setCollapsed(true);
            }}
            className={TOGGLE_BTN}
            aria-label={overlay ? "Close sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} strokeWidth={2.25} />
          </button>
        )}
      </div>

      {/* Separator — 1px rule at 8% opacity, 16px inset */}
      <div className="mx-4 h-px border-t border-white/8 dark:border-gray-700" />

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="mb-3 flex justify-center px-1">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className={TOGGLE_BTN}
              aria-label="Expand sidebar"
            >
              <ChevronRight size={16} strokeWidth={2.25} />
            </button>
          </div>
        )}

        {NAV_SECTIONS.map(({ label: sectionLabel, items }) => (
          <div key={sectionLabel} className="mt-4 first:mt-0">
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <p
                className="mb-1 text-[10px] uppercase tracking-widest text-white/30"
                style={{ paddingLeft: "20px" }}
              >
                {sectionLabel}
              </p>
            )}

            {items.map(({ to, label, icon: Icon }) => (
              /* Wrapper carries the named group for tooltip */
              <div key={to} className="group/item relative">
                <NavLink
                  to={to}
                  title={collapsed ? label : undefined}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      "group flex h-10 items-center gap-2.5 rounded-[10px] transition-colors duration-120",
                      collapsed
                        ? "mx-auto w-10 justify-center px-0"
                        : "mx-2.5 px-2",
                      isActive
                        ? "fs-nav-active text-white"
                        : "hover:bg-white/6",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={`shrink-0 transition-opacity duration-120 ${
                          isActive
                            ? "opacity-100 text-white"
                            : "text-white/45 group-hover:text-white/85"
                        }`}
                      />
                      {!collapsed && (
                        <span
                          className={`text-[13px] font-medium transition-opacity duration-120 ${
                            isActive
                              ? "text-white"
                              : "text-white/55 group-hover:text-white/85"
                          }`}
                        >
                          {label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Tooltip — visible only in collapsed mode */}
                {collapsed && (
                  <span
                    className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 -translate-x-1.5 whitespace-nowrap rounded-badge bg-gray-900/90 px-2.5 py-1.5 text-[12px] text-white opacity-0 transition-all delay-120 duration-120 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                    aria-hidden
                  >
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Separator */}
      <div className="mx-4 h-px border-t border-white/8 dark:border-gray-700" />

      {/* ── User profile footer ───────────────────────────────── */}
      <div className="shrink-0 p-4">
        {/* Avatar + info */}
        <div
          className={`mb-3 flex items-center ${
            collapsed ? "justify-center" : "gap-2.5"
          }`}
        >
          <div
            className="h-8 w-8 shrink-0 overflow-hidden rounded-full text-center text-[12px] font-bold leading-8 text-white"
            style={{
              background: LOGO_GRADIENT,
              /* 2px ring with 2px white gap via outline */
              outline: "2px solid rgba(255,255,255,0.2)",
              outlineOffset: "2px",
            }}
          >
            {profile?.initials ?? "A"}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium leading-tight text-white">
                {profile?.name ?? user?.email}
              </p>
              <p className="text-[11px] text-white/40">Operations Manager</p>
            </div>
          )}
        </div>

        {/* Logout — icon-only with tooltip */}
        <div
          className={`group/logout relative ${collapsed ? "flex justify-center" : ""}`}
        >
          <button
            type="button"
            onClick={handleLogout}
            className={`fs-focus-ring flex h-8 items-center justify-center rounded-[8px] text-white/40 transition-colors duration-150 hover:text-[rgba(239,68,68,0.7)] ${
              collapsed ? "w-8" : "w-full gap-2 px-2"
            }`}
            aria-label="Sign out"
          >
            <LogOut size={15} />
            {!collapsed && (
              <span className="text-[12px] font-medium">Sign out</span>
            )}
          </button>

          {/* Tooltip (collapsed only) */}
          {collapsed && (
            <span
              className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 -translate-x-1.5 whitespace-nowrap rounded-badge bg-gray-900/90 px-2.5 py-1.5 text-[12px] text-white opacity-0 transition-all delay-120 duration-120 group-hover/logout:translate-x-0 group-hover/logout:opacity-100"
              aria-hidden
            >
              Sign out
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
