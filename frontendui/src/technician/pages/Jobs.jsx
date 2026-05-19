import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";
import { SkeletonBlock } from "../../shared/components/Skeleton";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
];

export default function Jobs() {
  const { user } = useAuth();
  const { jobs, loading } = useTechnicianData(user?.id);
  const [filter, setFilter] = useState("ALL");

  const filteredJobs = useMemo(
    () =>
      filter === "ALL" ? jobs : jobs.filter((job) => job.status === filter),
    [jobs, filter],
  );

  return (
    <div className="space-y-4 py-4">
      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-0.5">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-badge border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                active
                  ? "border-[#27AE60] bg-[#27AE60]/10 text-[#27AE60]"
                  : "border-black/8 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Job list */}
      {loading ? (
        <TechnicianJobsSkeleton />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No jobs in this view"
          subtitle="Try another filter or check back later for new assignments."
        />
      ) : (
        <div className="space-y-2.5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function TechnicianJobsSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      {[1, 2, 3].map((row) => (
        <div
          key={row}
          className="mx-3 my-1 flex min-h-20 overflow-hidden rounded-r-[16px] rounded-l-none border border-black/5 bg-white"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          <div className="w-1 shrink-0 bg-slate-200" />
          <div className="flex-1 space-y-2.5 p-4">
            <SkeletonBlock className="h-4 w-2/3 rounded-md" />
            <SkeletonBlock className="h-3 w-1/2 rounded-md" />
            <SkeletonBlock className="h-3 w-2/5 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
