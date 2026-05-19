import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";
import { formatNotificationRelative } from "../../shared/utils/formatDate";
import { useAdminData } from "../hooks/useAdminData";

const TYPE_ACCENT = {
  STATUS_CHANGED: "bg-blue-500",
  JOB_VERIFIED: "bg-green-500",
  JOB_ASSIGNED: "bg-amber-500",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function firstName(fullName) {
  if (!fullName) return "there";
  return fullName.trim().split(/\s+/)[0];
}

export default function AdminTopbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = getUserById(user?.id);
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
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

  useEffect(() => {
    if (unreadCount > 0) {
      setBellAnimate(true);
    }
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handlePointerDown(event) {
      const target = event.target;
      if (
        panelRef.current?.contains(target) ||
        bellRef.current?.contains(target)
      ) {
        return;
      }
      setDropdownOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [dropdownOpen]);

  function handleNotificationClick(notification) {
    if (!notification.isRead) {
      markNotificationRead(notification.id);
    }
    setDropdownOpen(false);
    if (notification.jobId) {
      navigate(`/admin/jobs/${notification.jobId}`);
    }
  }

  const displayName = firstName(profile?.name ?? user?.name);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-[#F3F4F6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <p className="text-[13px] text-gray-500">{getGreeting()},</p>
          <h1 className="text-lg font-semibold leading-tight text-gray-900">
            <span
              className="bg-gradient-to-r from-[#1E3A5F] to-[#2E86AB] bg-clip-text text-transparent"
            >
              {displayName}
            </span>
          </h1>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-4">
          <label className="relative hidden min-w-[200px] max-w-md flex-1 sm:block">
            <Search
              size={18}
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                searchFocused ? "text-[#2E86AB]" : "text-gray-400"
              }`}
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search jobs, technicians..."
              className="fs-input fs-focus-ring h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] py-0 pl-10 pr-3 text-[13px] placeholder:text-[14px] placeholder:text-gray-400"
              aria-label="Search jobs and technicians"
            />
          </label>

          <div className="relative">
            <button
              ref={bellRef}
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className={`fs-btn-press fs-focus-ring relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA] text-gray-600 transition-colors hover:bg-gray-50 ${
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
              <Bell size={20} />
              {unreadCount > 0 ? (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#EF4444] px-1 text-[10px] font-semibold text-white"
                  aria-hidden
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {dropdownOpen ? (
              <div
                ref={panelRef}
                className="animate-dropdown-in absolute right-0 top-[calc(100%+8px)] w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white fs-shadow-elevated"
                role="menu"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between border-b border-[#F3F4F6] px-4 py-3">
                  <p className="text-[14px] font-semibold text-gray-900">
                    Notifications
                  </p>
                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[12px] font-medium text-[#2E86AB] hover:underline"
                    >
                      Mark all as read
                    </button>
                  ) : null}
                </div>

                <ul
                  className="max-h-[360px] overflow-y-auto"
                  role="none"
                >
                  {sortedNotifications.length === 0 ? (
                    <li className="px-4 py-8 text-center text-[13px] text-gray-500">
                      No notifications yet
                    </li>
                  ) : (
                    sortedNotifications.map((notification) => (
                      <li key={notification.id} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleNotificationClick(notification)}
                          className={`flex w-full gap-0 text-left transition-colors hover:bg-[#F8FAFC] ${
                            notification.isRead ? "bg-white" : "bg-[#F0F9FF]"
                          }`}
                        >
                          <span
                            className={`w-[3px] shrink-0 self-stretch ${
                              TYPE_ACCENT[notification.type] ?? "bg-slate-400"
                            }`}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1 px-4 py-3">
                            <p
                              className={`text-[13px] leading-snug ${
                                notification.isRead
                                  ? "text-gray-600"
                                  : "font-medium text-gray-900"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="fs-muted mt-1">
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
            ) : null}
          </div>

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#2E86AB] text-sm font-bold text-white shadow-[0_2px_6px_rgba(30,58,95,0.2)]"
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
