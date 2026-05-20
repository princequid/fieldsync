import { useMemo, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import JobCard from "../components/JobCard";
import EmptyState from "../../shared/components/EmptyState";

// controls how jobs are ordered on the page
const STATUS_ORDER = {
  IN_PROGRESS: 0,
  PENDING: 1,
  COMPLETED: 2,
  VERIFIED: 3,
};

// filter tabs
const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "IN_PROGRESS", label: "Active" },
  { key: "PENDING", label: "Pending" },
  { key: "DONE", label: "Done" },
];

// counts jobs for each filter button
function countFor(jobs, key) {
  if (key === "ALL") return jobs.length;

  // completed + verified both count as done
  if (key === "DONE") {
    return jobs.filter(
      (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
    ).length;
  }

  return jobs.filter((j) => j.status === key).length;
}

// sorts jobs based on status priority
function sortJobs(jobs) {
  return [...jobs].sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
  );
}

export default function TechJobs() {
  // current logged in technician
  const { user } = useAuth();

  // gets technician jobs
  const { jobs } = useTechnicianData(user?.id);

  // active filter tab
  const [activeFilter, setActiveFilter] = useState("ALL");

  // handles filtering + sorting jobs
  const filtered = useMemo(() => {
    let result = [...jobs];

    // active jobs
    if (activeFilter === "IN_PROGRESS") {
      result = result.filter((j) => j.status === "IN_PROGRESS");

      // pending jobs
    } else if (activeFilter === "PENDING") {
      result = result.filter((j) => j.status === "PENDING");

      // completed + verified jobs
    } else if (activeFilter === "DONE") {
      result = result.filter(
        (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
      );
    }

    return sortJobs(result);
  }, [jobs, activeFilter]);

  // reusable empty state
  const emptyMessage = (
    <EmptyState
      icon="📋"
      title="No jobs assigned"
      subtitle="Your admin will assign jobs to you. Check back soon."
    />
  );

  return (
    <div className="pb-4">
      {/* top filter buttons */}
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
            {/* filter label + count */}
            {label} ({countFor(jobs, key)})
          </button>
        ))}
      </div>

      {/* empty states */}
      {jobs.length === 0 ? (
        emptyMessage
      ) : filtered.length === 0 ? (
        emptyMessage
      ) : (
        // jobs list
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
