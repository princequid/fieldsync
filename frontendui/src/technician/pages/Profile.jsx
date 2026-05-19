import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";

export default function TechProfile() {
  // getting current logged in user info
  const { user, logout } = useAuth();

  // for page navigation
  const navigate = useNavigate();

  // fetch technician related jobs
  const { jobs } = useTechnicianData(user?.id);

  // getting extra mock user data
  const userData = getUserById(user?.id);

  // controls sign out bottom sheet visibility
  const [showSheet, setShowSheet] = useState(false);

  // fallback values just in case data is missing
  const completedThisMonth = userData?.completedThisMonth ?? 0;
  const avgDuration = userData?.avgDurationHours ?? null;

  // counts current active jobs
  const activeNow = jobs.filter(
    (j) => j.status === "IN_PROGRESS" || j.status === "PENDING",
  ).length;

  // handles logout and redirects back to login
  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-4 px-4 pb-8 pt-6">
      {/* top profile section */}
      <section className="flex flex-col items-center py-4 text-center">
        <div
          className="flex items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ height: "52px", width: "52px", backgroundColor: "#27AE60" }}
        >
          {userData?.initials ?? "T"}
        </div>

        {/* technician name */}
        <h1 className="mt-3 text-xl font-bold text-gray-900">
          {userData?.name ?? user?.email}
        </h1>

        <p className="text-sm text-gray-500">Field Technician</p>

        {/* online/active badge */}
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Active
        </span>
      </section>

      {/* stats cards */}
      <div className="grid grid-cols-3 gap-2">
        <StatTile
          value={completedThisMonth}
          label="Completed This Month"
        />

        <StatTile
          value={avgDuration ? `${avgDuration}h` : "—"}
          label="Avg. Duration"
        />

        <StatTile value={activeNow} label="Active Jobs Now" />
      </div>

      {/* personal info section */}
      <section className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <InfoRow label="Email" value={userData?.email ?? user?.email ?? "—"} />
        <InfoRow label="Phone" value={userData?.phone || "—"} />
        <InfoRow label="Role" value="Field Technician" />
      </section>

      {/* sign out button */}
      <button
        type="button"
        onClick={() => setShowSheet(true)}
        className="w-full rounded-2xl border border-red-200 bg-red-50 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        style={{ minHeight: "52px" }}
      >
        Sign Out
      </button>

      {/* logout confirmation sheet */}
      {showSheet && (
        <SignOutSheet
          onConfirm={handleSignOut}
          onClose={() => setShowSheet(false)}
        />
      )}
    </div>
  );
}

function StatTile({ value, label, sub }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center">
      {/* main stat number */}
      <p className="text-xl font-bold text-gray-900">{value}</p>

      {/* stat label */}
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>

      {/* optional extra text */}
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5"
      style={{ minHeight: "52px" }}
    >
      {/* left label */}
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>

      {/* actual info value */}
      <span className="text-sm text-gray-700">{value}</span>
    </div>
  );
}

function SignOutSheet({ onConfirm, onClose }) {
  // controls sheet animation state
  const [visible, setVisible] = useState(false);

  // trigger slide up animation after mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // closes sheet with animation first
  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <>
      {/* dark background overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-4 pb-8 pt-3 shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* small drag indicator */}
        <div className="mx-auto mb-5 h-0.75 w-7.5 rounded-full bg-gray-300" />

        <h2 className="text-center text-xl font-bold text-gray-900">
          Sign Out?
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          You'll need to log back in to see your jobs.
        </p>

        <div className="mt-6 space-y-3">
          {/* confirm logout */}
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-2xl bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            style={{ minHeight: "52px" }}
          >
            Yes, Sign Out
          </button>

          {/* cancel logout */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-2xl border border-slate-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:border-slate-300"
            style={{ minHeight: "52px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}