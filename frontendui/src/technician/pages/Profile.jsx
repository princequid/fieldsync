import { useState } from "react";
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

  const activeJobs = jobs.filter(
    (job) => job.status === "PENDING" || job.status === "IN_PROGRESS",
  ).length;
  const completed = jobs.filter(
    (job) => job.status === "COMPLETED" || job.status === "VERIFIED",
  ).length;
  const verified = jobs.filter((job) => job.status === "VERIFIED").length;

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-4 p-4">
      {/* Profile card */}
      <section className="fs-card flex items-center gap-4 p-5">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-[#27AE60] text-[17px] font-bold text-white"
          style={{ backgroundColor: "#27AE60", boxShadow: "0 0 0 3px #FFFFFF" }}
        >
          {profile?.initials ?? "T"}
        </div>
        <div>
          <h1 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
            {profile?.name ?? user?.email}
          </h1>
          <p className="text-[12px] text-gray-400 dark:text-gray-500">
            {profile?.specialty ?? "Field Technician"}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        <ProfileStatTile label="Active" value={activeJobs} accent="#2E86AB" />
        <ProfileStatTile label="Completed" value={completed} accent="#22C55E" />
        <ProfileStatTile label="Verified" value={verified} accent="#1E3A5F" />
      </section>

      {/* Contact info */}
      <section className="fs-card divide-y divide-black/5 dark:divide-gray-800">
        {profile?.specialty && (
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 dark:text-gray-300">
            <Wrench size={16} className="text-gray-400 dark:text-gray-500" aria-hidden />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Specialty
              </p>
              <p className="mt-0.5 font-medium">{profile.specialty}</p>
            </div>
          </div>
        )}
        {profile?.email && (
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 dark:text-gray-300">
            <Mail size={16} className="text-gray-400 dark:text-gray-500" aria-hidden />
            {profile.email}
          </div>
        )}
        {profile?.phone && (
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 dark:text-gray-300">
            <Phone size={16} className="text-gray-400 dark:text-gray-500" aria-hidden />
            {profile.phone}
          </div>
        )}
      </section>

      {/* Sign-out button */}
      <button
        type="button"
        onClick={() => setShowSignOut(true)}
        className="fs-btn-press fs-focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-button border border-red-200 bg-white text-[13px] font-medium text-red-600 dark:border-red-800 dark:bg-gray-900 dark:text-red-400"
      >
        <LogOut size={16} aria-hidden />
        Sign out
      </button>

      {/* Sign-out confirmation sheet */}
      {showSignOut && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-sheet-up w-full max-w-sm rounded-modal border border-black/6 bg-white p-5 shadow-4 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
              Sign out?
            </h2>
            <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400">
              You will need to sign in again to access your jobs.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowSignOut(false)}
                className="fs-btn-press fs-focus-ring flex-1 rounded-button border border-black/8 bg-white py-2.5 text-[13px] font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="fs-btn-press fs-focus-ring flex-1 rounded-button bg-red-600 py-2.5 text-[13px] font-medium text-white"
              >
                Sign out
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
