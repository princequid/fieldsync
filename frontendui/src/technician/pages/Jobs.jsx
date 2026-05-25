import { useMemo, useState, useRef, useEffect } from "react";
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

  const counts = useMemo(() => {
    const map = { ALL: jobs.length, PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    jobs.forEach((j) => {
      if (j.status === "PENDING") map.PENDING += 1;
      if (j.status === "IN_PROGRESS") map.IN_PROGRESS += 1;
      if (j.status === "COMPLETED") map.COMPLETED += 1;
    });
    return map;
  }, [jobs]);

  const buttonsRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const buttonsContainer = buttonsRef.current;
    const indicator = indicatorRef.current;
    if (!buttonsContainer || !indicator) return;
    const buttons = Array.from(buttonsContainer.querySelectorAll("button"));
    const activeIndex = buttons.findIndex(
      (b) => b.getAttribute("data-key") === filter,
    );
    const activeButton = buttons[activeIndex] || buttons[0];
    if (!activeButton) {
      indicator.style.opacity = "0";
      return;
    }
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = "1";
  }, [filter, counts]);

  return (
    <div className="bg-transparent">
      {/* Filter row */}
      <div
        className="bg-white dark:bg-gray-900 border-b"
        style={{
          borderBottom: "1px solid #F1F5F9",
          boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="relative px-4 py-3">
          <div className="relative">
            <div
              ref={indicatorRef}
              className="absolute top-3 h-10 rounded-badge bg-[#2E86AB] opacity-0 pointer-events-none transition-all duration-200"
              style={{ zIndex: 0 }}
            />
            <div
              ref={buttonsRef}
              className="grid grid-cols-4 gap-2 relative z-10"
            >
              {FILTERS.map(({ key, label }) => {
                const active = filter === key;
                const count = counts[key] ?? 0;
                return (
                  <button
                    key={key}
                    data-key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`w-full rounded-badge px-2 py-2 text-[13px] transition-all duration-150 ${
                      active
                        ? "bg-[#2E86AB] text-white font-semibold shadow-[0_1px_4px_rgba(46,134,171,0.3)]"
                        : "bg-[#F1F5F9] dark:bg-gray-800 text-[#64748B] dark:text-gray-400"
                    }`}
                    style={{ borderRadius: 20 }}
                  >
                    <span className="flex items-center justify-center gap-1 whitespace-nowrap">
                      <span>{label}</span>
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${
                          active
                            ? "bg-[rgba(255,255,255,0.25)] text-white"
                            : "bg-[rgba(0,0,0,0.06)] text-[10px] text-[#0F172A] dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="text-[10px] font-medium">{count}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="pt-3 pb-3">
        {filteredJobs.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No jobs assigned"
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
    </div>
  );
}
