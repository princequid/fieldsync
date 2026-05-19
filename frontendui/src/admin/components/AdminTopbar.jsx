import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";
import { formatNotificationRelative } from "../../shared/utils/formatDate";
import { useAdminData } from "../hooks/useAdminData";

const TYPE_ACCENT = {
  STATUS_CHANGED: "bg-blue-500",
  JOB_VERIFIED: "bg-green-500",
  JOB_ASSIGNED: "bg-amber-500",
};

/* Derive page title + subtitle from current route + live data */
function getPageInfo(pathname, jobs, technicians) {
  if (pathname === "/admin/dashboard" || pathname === "/admin") {
    return { title: "Dashboard", subtitle: "Overview of today's operations" };
  }
  if (pathname === "/admin/jobs/new") {
    return { title: "New Job", subtitle: "Create and assign a new field job" };
  }
  if (/^\/admin\/jobs\/[^/]+$/.test(pathname)) {
    return {
      title: "Job Details",
      subtitle: "View and manage job information",
    };
  }
  if (pathname.startsWith("/admin/jobs")) {
    return { title: "All Jobs", subtitle: `${jobs.length} total jobs` };
  }
  if (pathname.startsWith("/admin/team")) {
    return {
      title: "Team",
      subtitle: `${technicians.length} field technician${technicians.length !== 1 ? "s" : ""}`,
    };
  }
  if (pathname.startsWith("/admin/analytics")) {
    return {
      title: "Analytics",
      subtitle: "Performance metrics · Field ops data",
    };
  }
  return { title: "FieldSync", subtitle: "Operations Platform" };
}

export default function AdminTopbar({ showMenuButton = false, onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const profile = getUserById(user?.id);
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    jobs,
    technicians,
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellAnimate, setBellAnimate] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [notifications],
  );

  const { title, subtitle } = useMemo(
    () => getPageInfo(location.pathname, jobs, technicians),
    [location.pathname, jobs, technicians],
  );

  /* Ring the bell once on mount if there are unread notifications */
  useEffect(() => {
    if (unreadCount > 0) setBellAnimate(true);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handlePointerDown(event) {
      if (
        panelRef.current?.contains(event.target) ||
        bellRef.current?.contains(event.target)
      )
        return;
      setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [dropdownOpen]);

  function handleNotificationClick(notification) {
    if (!notification.isRead) markNotificationRead(notification.id);
    setDropdownOpen(false);
    if (notification.jobId) navigate(`/admin/jobs/${notification.jobId}`);
  }

  function renderNotificationMessage(message) {
    const match = message.match(/(#\w+-\d+)/i);
    if (!match) return message;

    const token = match[0];
    const parts = message.split(token);

    return (
      <>
        {parts[0]}
        <span className="font-medium">{token}</span>
        {parts[1]}
      </>
    );
  }

  return (
    <header
      className="sticky top-0 z-30 shrink-0 bg-white"
      style={{
        height: "64px",
        borderBottom: "1px solid #F1F5F9",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex h-full items-center justify-between gap-6 px-6">
        {/* ── Left: page title + subtitle ──────────────────────── */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="fs-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:bg-gray-50"
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold leading-tight tracking-[-0.015em] text-[#0F172A]">
              {title}
            </h1>
            <p className="mt-0.5 truncate text-[12px] text-[#94A3B8]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* ── Right cluster ─────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-end gap-2.5">
          {/* Search input — expands 220→260px on focus */}
          <div className="relative hidden sm:block">
            <Search
              size={15}
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
                searchFocused ? "text-[#2E86AB]" : "text-[#94A3B8]"
              }`}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search…"
              className="h-9 rounded-input border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-[13px] text-gray-900 outline-none transition-[width,box-shadow] duration-150 placeholder:text-[#94A3B8] focus:border-[#2E86AB] focus:shadow-[0_0_0_3px_rgba(46,134,171,0.12)] focus:bg-white"
              style={{ width: searchFocused ? "260px" : "220px" }}
              aria-label="Search jobs and technicians"
            />
            {/* ⌘K hint — disappears when user types */}
            {!searchQuery && (
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#CBD5E1]"
                aria-hidden
              >
                ⌘K
              </span>
            )}
          </div>

          {/* Bell */}
          <div className="relative">
            <button
              ref={bellRef}
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] transition-colors hover:bg-gray-100 hover:text-gray-700 ${
                bellAnimate ? "animate-bell-ring" : ""
              }`}
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <Bell size={18} />
              {/* Unread badge — 8×8 circle with 2px white border */}
              {unreadCount > 0 && (
                <span
                  className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#EF4444]"
                  style={{ border: "2px solid white" }}
                  aria-hidden
                />
              )}
            </button>

            {/* Notification dropdown */}
            {dropdownOpen && (
              <div
                ref={panelRef}
                className="animate-scale-in absolute right-0 top-[calc(100%+8px)] w-90 overflow-hidden border border-[#F1F5F9] bg-white"
                style={{
                  borderRadius: "16px",
                  maxHeight: "420px",
                  boxShadow: "var(--shadow-3)",
                  transformOrigin: "top right",
                }}
                role="menu"
                aria-label="Notifications"
              >
                <div className="flex h-12 items-center justify-between border-b border-[#F1F5F9] bg-white px-4">
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    Notifications
                  </p>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[12px] text-[#2E86AB] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={unreadCount === 0}
                  >
                    Mark all read
                  </button>
                </div>

                <ul
                  className="overflow-y-auto"
                  style={{ maxHeight: "360px" }}
                  role="none"
                >
                  {sortedNotifications.length === 0 ? (
                    <li className="px-4 py-8">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <svg
                          width="56"
                          height="56"
                          viewBox="0 0 56 56"
                          aria-hidden
                        >
                          <rect
                            x="7"
                            y="8"
                            width="42"
                            height="40"
                            rx="12"
                            fill="#F8FAFC"
                          />
                          <path
                            d="M28 14c-6 0-10 5-10 12v8l-4 5h28l-4-5v-8c0-7-4-12-10-12z"
                            fill="#E2E8F0"
                            stroke="#94A3B8"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="28"
                            cy="42"
                            r="3"
                            fill="#2E86AB"
                            opacity="0.45"
                          />
                        </svg>
                        <p className="text-[13px] text-[#94A3B8]">
                          No notifications yet
                        </p>
                      </div>
                    </li>
                  ) : (
                    sortedNotifications.map((notification) => (
                      <li key={notification.id} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative flex h-16 w-full gap-0 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                            notification.isRead ? "bg-white" : "bg-[#F0F9FF]"
                          }`}
                        >
                          <span
                            className={`absolute inset-y-0 left-0 w-0.75 ${
                              TYPE_ACCENT[notification.type] ?? "bg-slate-300"
                            }`}
                            aria-hidden
                          />
                          {!notification.isRead && (
                            <span
                              className="absolute right-3 top-2 h-2 w-2 rounded-full bg-[#2E86AB]"
                              aria-hidden
                            />
                          )}
                          <span className="min-w-0 flex-1 pl-1">
                            <p className="line-clamp-1 pr-4 text-[13px] leading-snug text-[#374151]">
                              {renderNotificationMessage(notification.message)}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-[#94A3B8]">
                              {formatNotificationRelative(
                                notification.createdAt,
                              )}
                            </p>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Avatar — gradient #2E86AB → #1A6FA8, 2px white border, ring glow */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #2E86AB 0%, #1A6FA8 100%)",
              border: "2px solid white",
              boxShadow: "0 0 0 3px rgba(46,134,171,0.15)",
            }}
            title={profile?.name ?? user?.email}
            aria-hidden
          >
            {profile?.initials ?? user?.initials ?? "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
