import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronRight, ClipboardList, MapPin } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";

const STATUS_ORDER = { IN_PROGRESS: 0, PENDING: 1, COMPLETED: 2, VERIFIED: 3 };

const STATUS_META = {
  IN_PROGRESS: {
    strip: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    label: "In Progress",
  },
  PENDING: {
    strip: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    label: "Pending",
  },
  COMPLETED: {
    strip: "bg-green-500",
    badge: "bg-green-100 text-green-700",
    label: "Completed",
  },
  VERIFIED: {
    strip: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600",
    label: "Verified",
  },
};

const PRIORITY_BADGE = {
  HIGH: "bg-red-100 text-red-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-green-100 text-green-700",
};

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "IN_PROGRESS", label: "Active" },
  { key: "PENDING", label: "Pending" },
  { key: "DONE", label: "Done" },
];

function countFor(jobs, key) {
  if (key === "ALL") return jobs.length;
  if (key === "DONE")
    return jobs.filter(
      (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
    ).length;
  return jobs.filter((j) => j.status === key).length;
}

export default function TechJobs() {
  const { jobs, addJob } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (activeFilter === "IN_PROGRESS")
      result = result.filter((j) => j.status === "IN_PROGRESS");
    else if (activeFilter === "PENDING")
      result = result.filter((j) => j.status === "PENDING");
    else if (activeFilter === "DONE")
      result = result.filter(
        (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
      );
    result.sort(
      (a, b) =>
        (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
    );
    return result;
  }, [jobs, activeFilter]);

  function showToast(job) {
    clearTimeout(toastTimer.current);
    setToast(job);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  function handleSimulate() {
    const fakeJob = {
      id: `job-sim-${Date.now()}`,
      jobNumber: "#JOB-0099",
      title: "Emergency Generator Fix",
      description: "Generator fault reported at main site.",
      location: "Cantonments, Accra",
      clientId: "client-3",
      technicianId: user?.id,
      status: "PENDING",
      priority: "HIGH",
      statusHistory: [
        {
          status: "PENDING",
          changedByName: "Admin",
          changedAt: new Date().toISOString(),
          note: null,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addJob(fakeJob);
    showToast(fakeJob);
  }

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <div className="pb-6">
      {/* Toast notification */}
      {toast && (
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${toast.id}`)}
          className="fixed left-4 right-4 top-4 z-50 rounded-2xl px-4 py-3 text-left text-white shadow-xl"
          style={{ backgroundColor: "#1a2e1a" }}
        >
          <p className="text-sm font-medium">
            📋 New Job Assigned — {toast.title}
          </p>
        </button>
      )}

      {/* Filter tabs — horizontally scrollable */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-2 px-4 py-3" style={{ width: "max-content", minWidth: "100%" }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              style={{ minHeight: "44px" }}
              className={`shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                activeFilter === key
                  ? "border-[#27AE60] bg-[#27AE60] text-white"
                  : "border-slate-200 bg-white text-gray-600 hover:border-[#27AE60] hover:text-[#27AE60]"
              }`}
            >
              {label} ({countFor(jobs, key)})
            </button>
          ))}
        </div>
      </div>

      {/* Job list / empty state */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3 px-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => navigate(`/tech/jobs/${job.id}`)}
            />
          ))}
        </div>
      )}

      {/* Dev simulate button */}
      {import.meta.env.DEV && (
        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={handleSimulate}
            style={{ minHeight: "44px" }}
            className="w-full rounded-2xl border border-dashed border-slate-300 bg-white text-xs text-gray-400 transition-colors hover:border-[#27AE60] hover:text-[#27AE60]"
          >
            [Dev] Simulate New Job
          </button>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onView }) {
  const client = getUserById(job.clientId);
  const meta = STATUS_META[job.status] ?? STATUS_META.PENDING;
  const priorityClass = PRIORITY_BADGE[job.priority] ?? PRIORITY_BADGE.LOW;
  const updatedAt = formatRelative(job.updatedAt);

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Left accent strip */}
      <div className={`w-0.75 shrink-0 ${meta.strip}`} />

      <div className="flex-1 p-4">
        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="flex-1 font-semibold leading-snug text-gray-900">
            {job.title}
          </p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Client */}
        <p className="mt-1 text-xs text-gray-500">
          {client?.name ?? "Unknown client"}
        </p>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} className="shrink-0 text-gray-400" />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityClass}`}
            >
              {job.priority}
            </span>
            <span className="text-xs text-gray-400">{updatedAt}</span>
          </div>
          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-0.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-slate-100"
            style={{ minHeight: "36px" }}
          >
            View <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <ClipboardList size={48} className="mb-4 text-slate-300" />
      <p className="text-lg font-semibold text-gray-700">No jobs assigned</p>
      <p className="mt-2 text-sm text-gray-500">
        Your admin will assign jobs to you. Check back soon.
      </p>
    </div>
  );
}

function formatRelative(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
