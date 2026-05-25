import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
];

export default function Jobs() {
  const { user } = useAuth();
  const { jobs } = useTechnicianData(user?.id);
  const [filter, setFilter] = useState("ALL");

  const filteredJobs = useMemo(
    () =>
      filter === "ALL" ? jobs : jobs.filter((job) => job.status === filter),
    [jobs, filter],
  );

  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-0.5">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-badge border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                active
                  ? "border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]"
                  : "border-black/8 bg-white text-gray-500 hover:border-black/12 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:border-gray-600 dark:hover:bg-gray-700/80"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No jobs in this view"
          subtitle="Try another filter or check back later for new assignments."
        />
      ) : (
        <div className="space-y-2.5 fs-content-settled">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
