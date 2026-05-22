import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";
import { LogOut, Mail, Phone, MapPin, Lock, Zap, Droplets, Wind, Shield, Flame, Wrench, Wifi } from "lucide-react";

const SPECIALISATION_STYLES = {
  Electrical: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", icon: <Zap size={12} /> },
  Plumbing:   { bg: "bg-green-50", text: "text-green-800", border: "border-green-200", icon: <Droplets size={12} /> },
  HVAC:       { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", icon: <Wind size={12} /> },
  Security:   { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200", icon: <Shield size={12} /> },
  "Fire safety": { bg: "bg-red-50", text: "text-red-800", border: "border-red-200", icon: <Flame size={12} /> },
  Mechanical: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", icon: <Wrench size={12} /> },
  Networking: { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200", icon: <Wifi size={12} /> },
};

function SpecialisationPill({ label }) {
  const style = SPECIALISATION_STYLES[label] ?? {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: <Wrench size={12} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.icon}
      {label}
    </span>
  );
}

export default function TechProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { jobs } = useTechnicianData(user?.id);
  const userData = getUserById(user?.id);
  const [showSheet, setShowSheet] = useState(false);

  // availability toggle — reads from userData, technician can flip it locally
  const [available, setAvailable] = useState(userData?.available ?? true);

  const completedThisMonth = userData?.completedThisMonth ?? 0;
  const avgDuration = userData?.avgDurationHours ?? null;
  const activeNow = jobs.filter(
    (j) => j.status === "IN_PROGRESS" || j.status === "PENDING"
  ).length;

  const specialisations = userData?.specialisations ?? [];

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="pb-10">

      {/* hero card */}
      <div className="mx-4 mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

        {/* coloured top band */}
        <div className="h-16 bg-gradient-to-r from-[#1E3A5F] to-[#2E86AB]" />

        <div className="px-5 pb-5 -mt-8">
          {/* avatar with ring */}
          <div className="w-16 h-16 rounded-full border-4 border-white bg-[#27AE60] flex items-center justify-center mb-3 shadow-sm">
            <span className="text-xl font-bold text-white">
              {userData?.initials ?? "T"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {userData?.name ?? user?.email}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {userData?.employeeId ?? "Field Technician"} · SwiftFix
              </p>
            </div>

            {/* availability toggle — technician can tap this */}
            <button
              type="button"
              onClick={() => setAvailable((v) => !v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
                available
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}
            >
              {/* toggle track */}
              <span
                className={`relative inline-flex w-8 h-4 rounded-full transition-colors duration-200 ${
                  available ? "bg-[#27AE60]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                    available ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
              {available ? "Available" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 mt-3">

        {/* stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-[#27AE60]">{completedThisMonth}</p>
            <p className="text-xs text-gray-400 mt-1">Completed this month</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-[#2E86AB]">{activeNow}</p>
            <p className="text-xs text-gray-400 mt-1">Active jobs now</p>
          </div>
        </div>

        {/* contact info */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Contact info</p>
          </div>
          <InfoRow
            icon={<Mail size={14} className="text-[#2E86AB]" />}
            iconBg="bg-blue-50"
            label="Email"
            value={userData?.email ?? user?.email ?? "—"}
          />
          <InfoRow
            icon={<Phone size={14} className="text-[#27AE60]" />}
            iconBg="bg-green-50"
            label="Phone"
            value={userData?.phone || "—"}
          />
          <InfoRow
            icon={<MapPin size={14} className="text-slate-400" />}
            iconBg="bg-slate-100"
            label="Base location"
            value={userData?.location ?? "Accra, Ghana"}
            last
          />
        </section>

        {/* specialisations — read only, set by admin */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Specialisations</p>
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              <Lock size={10} aria-hidden />
              Admin only
            </span>
          </div>

          {specialisations.length > 0 ? (
            <div className="px-4 py-4 flex flex-wrap gap-2">
              {specialisations.map((s) => (
                <SpecialisationPill key={s} label={s} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-4">
              <p className="text-sm text-gray-400">No specialisations assigned yet.</p>
            </div>
          )}

          {/* admin notice */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <Lock size={11} className="text-gray-300 shrink-0" aria-hidden />
            <p className="text-xs text-gray-400">
              Specialisations are assigned by your admin and cannot be edited here.
            </p>
          </div>
        </section>

        {/* sign out */}
        <button
          type="button"
          onClick={() => setShowSheet(true)}
          className="w-full h-12 rounded-2xl border border-red-100 bg-red-50 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors active:scale-[0.98]"
        >
          <LogOut size={15} aria-hidden />
          Sign Out
        </button>
      </div>

      {showSheet && (
        <SignOutSheet onConfirm={handleSignOut} onClose={() => setShowSheet(false)} />
      )}
    </div>
  );
}

function InfoRow({ icon, iconBg, label, value, last }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${!last ? "border-b border-slate-100" : ""}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function SignOutSheet({ onConfirm, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-4 pb-10 pt-4 shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-5 h-1 w-8 rounded-full bg-slate-200" />
        <h2 className="text-center text-xl font-bold text-gray-900">Sign Out?</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          You&apos;ll need to log back in to see your jobs.
        </p>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-2xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors active:scale-[0.98]"
            style={{ minHeight: "52px" }}
          >
            Yes, Sign Out
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-2xl border border-slate-200 bg-white text-sm font-medium text-gray-700 hover:bg-slate-50 transition-colors"
            style={{ minHeight: "52px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}