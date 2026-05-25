import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone, Wrench } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";
import { useTechnicianData } from "../hooks/useTechnicianData";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = getUserById(user?.id);
  const { jobs } = useTechnicianData(user?.id);
  const [showSignOut, setShowSignOut] = useState(false);
  const presenceStorageKey = `fieldsync_tech_presence_${user?.id ?? "unknown"}`;
  const [isActive, setIsActive] = useState(() => {
    try {
      const stored = localStorage.getItem(presenceStorageKey);
      if (stored === "active") return true;
      if (stored === "offline") return false;
    } catch {
      // Ignore storage failures and use profile fallback.
    }
    return Boolean(profile?.online);
  });

  const activeJobs = jobs.filter(
    (job) => job.status === "PENDING" || job.status === "IN_PROGRESS",
  ).length;
  const completed = jobs.filter(
    (job) => job.status === "COMPLETED" || job.status === "VERIFIED",
  ).length;
  const verified = jobs.filter((job) => job.status === "VERIFIED").length;

  useEffect(() => {
    try {
      localStorage.setItem(presenceStorageKey, isActive ? "active" : "offline");
    } catch {
      // Ignore storage failures so UI still works.
    }
  }, [isActive, presenceStorageKey]);

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div
      style={{ background: "#F0EDE8" }}
      className="min-h-screen dark:bg-gray-950"
    >
      {/* Header */}
      <div
        className="bg-white dark:bg-gray-900"
        style={{ borderBottom: "1px solid #F1F5F9", padding: 24 }}
      >
        <div className="flex flex-col items-center">
          <div
            className="rounded-full grid place-items-center"
            aria-hidden
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg,#2E86AB,#1A6FA8)",
              border: "3px solid #2E86AB",
              boxShadow: "0 0 0 3px #FFFFFF, 0 0 0 6px #2E86AB",
            }}
          >
            <span className="text-white text-[24px] font-bold">
              {profile?.initials ?? "T"}
            </span>
          </div>
          <h1
            className="mt-3 text-[18px] font-bold text-[#0F172A] dark:text-gray-50"
            style={{ letterSpacing: "-0.3px" }}
          >
            {profile?.name ?? user?.email}
          </h1>
          <p className="mt-1 text-[13px] text-[#64748B] dark:text-gray-400">
            {profile?.specialty ?? "Field Technician"}
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsActive((current) => !current)}
              aria-pressed={isActive}
              className={`inline-flex h-11 items-center justify-center rounded-badge border px-4 text-[13px] font-semibold transition-colors ${
                isActive
                  ? "bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2E86AB] dark:text-blue-300 border-[#BFDBFE] dark:border-blue-800"
                  : "bg-[#F8FAFC] dark:bg-gray-800 text-[#64748B] dark:text-gray-300 border-[#E2E8F0] dark:border-gray-700"
              }`}
            >
              {isActive ? "Active" : "Offline"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3" style={{ margin: "8px 12px 0" }}>
        <div
          className="rounded-[12px] border bg-white dark:bg-gray-900 p-3"
          style={{ border: "1px solid #F1F5F9" }}
        >
          <p className="text-[22px] font-bold text-[#0F172A] dark:text-gray-50">
            {activeJobs}
          </p>
          <p className="mt-1 text-[11px] text-[#94A3B8] dark:text-gray-500 uppercase tracking-wide">
            Active
          </p>
        </div>
        <div
          className="rounded-[12px] border bg-white dark:bg-gray-900 p-3"
          style={{ border: "1px solid #F1F5F9" }}
        >
          <p className="text-[22px] font-bold text-[#2E86AB]">{completed}</p>
          <p className="mt-1 text-[11px] text-[#94A3B8] dark:text-gray-500 uppercase tracking-wide">
            Completed
          </p>
        </div>
        <div
          className="rounded-[12px] border bg-white dark:bg-gray-900 p-3"
          style={{ border: "1px solid #F1F5F9" }}
        >
          <p
            className="text-[22px] font-bold"
            style={{ color: verified > 0 ? "#F59E0B" : "#0F172A" }}
          >
            {verified}
          </p>
          <p className="mt-1 text-[11px] text-[#94A3B8] dark:text-gray-500 uppercase tracking-wide">
            Verified
          </p>
        </div>
      </div>

      {/* Info section */}
      <div style={{ margin: "8px 12px 0" }}>
        <div
          className="rounded-[12px] bg-white dark:bg-gray-900"
          style={{ border: "1px solid #F1F5F9" }}
        >
          {profile?.specialty && (
            <div
              className="flex items-center"
              style={{
                height: 52,
                padding: "0 16px",
                borderBottom: "1px solid #F8FAFC",
              }}
            >
              <div className="h-7 w-7 rounded-full grid place-items-center bg-[#F8FAFC] dark:bg-gray-800 mr-4">
                <Wrench size={16} className="text-[#94A3B8]" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#94A3B8]">
                  Specialty
                </div>
                <div className="text-[13px] font-medium text-[#374151] dark:text-gray-200">
                  {profile.specialty}
                </div>
              </div>
            </div>
          )}
          {profile?.email && (
            <div
              className="flex items-center"
              style={{
                height: 52,
                padding: "0 16px",
                borderBottom: "1px solid #F8FAFC",
              }}
            >
              <div className="h-7 w-7 rounded-full grid place-items-center bg-[#F8FAFC] dark:bg-gray-800 mr-4">
                <Mail size={16} className="text-[#94A3B8]" />
              </div>
              <div className="text-[13px] font-medium text-[#374151] dark:text-gray-200">
                {profile.email}
              </div>
            </div>
          )}
          {profile?.phone && (
            <div
              className="flex items-center"
              style={{ height: 52, padding: "0 16px" }}
            >
              <div className="h-7 w-7 rounded-full grid place-items-center bg-[#F8FAFC] dark:bg-gray-800 mr-4">
                <Phone size={16} className="text-[#94A3B8]" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#94A3B8]">
                  Phone
                </div>
                <div className="text-[13px] font-medium text-[#374151] dark:text-gray-200">
                  {profile.phone}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign-out button */}
      <div style={{ margin: "12px" }}>
        <button
          type="button"
          onClick={() => setShowSignOut(true)}
          className="w-full h-12 rounded-[12px] text-[14px] font-medium"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={16} />
            Sign out
          </div>
        </button>
      </div>

      {/* Sign-out confirmation sheet */}
      {showSignOut && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              paddingBottom: 36,
            }}
            className="dark:bg-gray-900"
          >
            <div
              className="mx-auto w-10 h-1.5 rounded-full"
              style={{ background: "#E2E8F0", marginBottom: 12 }}
            />
            <h2 className="text-[18px] font-bold text-[#0F172A] dark:text-gray-50 text-center">
              Sign Out?
            </h2>
            <p className="mt-2 text-[14px] text-[#64748B] dark:text-gray-400 text-center">
              You will need to sign in again to access your jobs.
            </p>
            <div className="mt-5">
              <button
                onClick={handleSignOut}
                className="w-full h-12 rounded-[12px] text-white font-semibold"
                style={{
                  background: "linear-gradient(180deg,#EF4444,#DC2626)",
                }}
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowSignOut(false)}
                className="w-full h-12 mt-2 rounded-[12px] bg-[#F8FAFC] text-[#374151]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileStatTile({ label, value, accent }) {
  return (
    <div
      className="rounded-card border border-black/6 bg-white p-3 text-center dark:border-gray-800 dark:bg-gray-900"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <p
        className="text-[18px] font-bold leading-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}
