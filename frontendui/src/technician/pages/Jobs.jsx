import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";

const STATUS_ORDER = {
  IN_PROGRESS: 0,
  PENDING: 1,
  COMPLETED: 2,
  VERIFIED: 3,
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
      (j) => j.status === "COMPLETED" || j.status === "VERIFIED"
    ).length;
  return jobs.filter((j) => j.status === key).length;
}

function sortJobs(jobs) {
  return [...jobs].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
  );
}

export default function TechJobs() {
  const { user } = useAuth();
  const { jobs } = useTechnicianData(user?.id);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (activeFilter === "IN_PROGRESS")
      result = result.filter((j) => j.status === "IN_PROGRESS");
    else if (activeFilter === "PENDING")
      result = result.filter((j) => j.status === "PENDING");
    else if (activeFilter === "DONE")
      result = result.filter(
        (j) => j.status === "COMPLETED" || j.status === "VERIFIED"
      );
    return sortJobs(result);
  }, [jobs, activeFilter]);

  const emptyMessage = (
    <EmptyState
      icon="📋"
      title="No jobs assigned"
      subtitle="Your admin will assign jobs to you. Check back soon."
    />
  );

  return (
    <div className="pb-6">
      {/* header summary */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-semibold text-gray-900">My Jobs</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      {/* filter pills */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-none">
        {FILTERS.map(({ key, label }) => {
          const count = countFor(jobs, key);
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#27AE60] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-gray-600 hover:border-slate-300"
              }`}
            >
              {label}
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* job list */}
      {jobs.length === 0 ? (
        emptyMessage
      ) : filtered.length === 0 ? (
        emptyMessage
      ) : (
        <ul className="space-y-3 px-4">
          {filtered.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}