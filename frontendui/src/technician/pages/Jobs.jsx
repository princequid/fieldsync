import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";

const STATUS_ORDER = { IN_PROGRESS: 0, PENDING: 1, COMPLETED: 2, VERIFIED: 3 };

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "IN_PROGRESS", label: "Active" },
  { key: "PENDING", label: "Pending" },
  { key: "DONE", label: "Done" },
];

function countFor(jobs, key) {
  if (key === "ALL") return jobs.length;
  if (key === "DONE") {
    return jobs.filter(
      (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
    ).length;
  }
  return jobs.filter((j) => j.status === key).length;
}

function sortJobs(jobs) {
  return [...jobs].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
  );
}

export default function TechJobs() {
  const { user } = useAuth();
  const { jobs } = useTechnicianData(user?.id);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (activeFilter === "IN_PROGRESS") {
      result = result.filter((j) => j.status === "IN_PROGRESS");
    } else if (activeFilter === "PENDING") {
      result = result.filter((j) => j.status === "PENDING");
    } else if (activeFilter === "DONE") {
      result = result.filter(
        (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
      );
    }
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
    <div className="pb-4">
      <div className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-4">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            className={`min-h-11 rounded-full border px-3 text-sm font-medium transition-colors ${
              activeFilter === key
                ? "border-[#27AE60] bg-[#27AE60] text-white"
                : "border-slate-200 bg-white text-gray-600"
            }`}
          >
            {label} ({countFor(jobs, key)})
          </button>
        ))}
      </div>

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
