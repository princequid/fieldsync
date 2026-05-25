import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";
import { LogOut, Mail, Phone, MapPin, Lock, Zap, Droplets, Wind, Shield, Flame, Wrench, Wifi } from "lucide-react";

const SPECIALISATION_STYLES = {
  Electrical: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", icon: <Zap size={12} /> },
  Plumbing: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200", icon: <Droplets size={12} /> },
  HVAC: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", icon: <Wind size={12} /> },
  Security: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200", icon: <Shield size={12} /> },
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

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = getUserById(user?.id);
  const { jobs } = useTechnicianData(user?.id);
  const [showSignOut, setShowSignOut] = useState(false);
  const [available, setAvailable] = useState(profile?.available ?? true);

  const activeJobs = jobs.filter((job) => job.status === "PENDING" || job.status === "IN_PROGRESS").length;
  const completed = jobs.filter((job) => job.status === "COMPLETED" || job.status === "VERIFIED").length;
  const verified = jobs.filter((job) => job.status === "VERIFIED").length;
  const specialisations = profile?.specialisations ?? [];

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
    <div className="pb-10">
      <div className="mx-4 mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-[#1E3A5F] to-[#2E86AB]" />
        <div className="px-5 pb-5 -mt-8">
          <div className="w-16 h-16 rounded-full border-4 border-white bg-[#27AE60] flex items-center justify-center mb-3 shadow-sm">
            <span className="text-xl font-bold text-white">{profile?.initials ?? "T"}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{profile?.name ?? user?.email}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{profile?.employeeId ?? "Field Technician"} · SwiftFix</p>
            </div>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-[#27AE60]">{completed}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-[#2E86AB]">{activeJobs}</p>
            <p className="text-xs text-gray-400 mt-1">Active now</p>
          </div>
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

        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Contact info</p>
          </div>
          <InfoRow
            icon={<Mail size={14} className="text-[#2E86AB]" />}
            iconBg="bg-blue-50"
            label="Email"
            value={profile?.email ?? user?.email ?? "—"}
          />
          <InfoRow
            icon={<Phone size={14} className="text-[#27AE60]" />}
            iconBg="bg-green-50"
            label="Phone"
            value={profile?.phone || "—"}
          />
          <InfoRow
            icon={<MapPin size={14} className="text-slate-400" />}
            iconBg="bg-slate-100"
            label="Base location"
            value={profile?.location ?? "Accra, Ghana"}
            last
          />
        </section>

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
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <Lock size={11} className="text-gray-300 shrink-0" aria-hidden />
            <p className="text-xs text-gray-400">
              Specialisations are assigned by your admin and cannot be edited here.
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setShowSignOut(true)}
          className="w-full h-12 rounded-2xl border border-red-100 bg-red-50 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={16} />
            Sign out
          </div>
        </button>
      </div>

      {showSignOut && (
        <SignOutSheet onConfirm={handleSignOut} onClose={() => setShowSignOut(false)} />
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

function ProfileStatTile({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-3 text-center dark:border-gray-800 dark:bg-gray-900" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <p className="text-[18px] font-bold leading-tight" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}
