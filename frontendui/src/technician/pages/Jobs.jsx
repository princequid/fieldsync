import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";
import { SkeletonBlock } from "../../shared/components/Skeleton";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "Active" },
  { key: "DONE", label: "Done" },
];

export default function TechJobs() {
  const { user } = useAuth();
  const { jobs, loading } = useTechnicianData(user?.id);
  const [filter, setFilter] = useState("ALL");

  const filteredJobs = useMemo(() => {
    if (filter === "ALL") return jobs;
    if (filter === "DONE") return jobs.filter((job) => job.status === "COMPLETED" || job.status === "VERIFIED");
    return jobs.filter((job) => job.status === filter);
  }, [jobs, filter]);

  const noJobs = (
    <EmptyState
      icon="📋"
      title="No jobs in this view"
      subtitle="Try another filter or check back later for new assignments."
    />
  );

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-semibold text-gray-900">My Jobs</h1>
        <p className="text-sm text-gray-400 mt-0.5">{jobs.length} job{jobs.length !== 1 ? "s" : ""} assigned to you</p>
      </div>

      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-none">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#27AE60] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-gray-600 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <TechnicianJobsSkeleton />
      ) : filteredJobs.length === 0 ? (
        noJobs
      ) : (
        <div className="space-y-3 px-4">
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
          className="mx-3 my-1 flex min-h-20 overflow-hidden rounded-r-[16px] rounded-l-none border border-black/5 bg-white dark:border-gray-800 dark:bg-gray-900"
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
