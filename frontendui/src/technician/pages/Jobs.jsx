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

  const filteredJobs = useMemo(() => {
    if (filter === "ALL") return jobs;
    return jobs.filter((job) => job.status === filter);
  }, [jobs, filter]);

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-2 px-3">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]"
                  : "border-[#E5E7EB] bg-[#FAFAFA] text-gray-600 hover:bg-gray-50"
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
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
