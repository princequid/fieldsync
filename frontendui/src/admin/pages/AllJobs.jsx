import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import { getUserById } from "../../shared/utils/mockData";
import Table from "../../admin/components/Table";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import EmptyState from "../../shared/components/EmptyState";
import VerifyModal from "../components/modals/VerifyModal";
import { SkeletonBlock } from "../../shared/components/Skeleton";

const PAGE_SIZE = 20;

const STATUS_TABS = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

const SORT_OPTIONS = [
  { value: "LAST_UPDATED", label: "Last Updated" },
  { value: "PRIORITY", label: "Priority (High first)" },
  { value: "JOB_NUMBER", label: "Job Number" },
];

const PRIORITY_WEIGHT = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function AllJobs() {
  const { jobs, verifyJob, rejectJob, loading, error, refetch } =
    useAdminData();
  const [activeTab, setActiveTab] = useState("ALL");
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState("LAST_UPDATED");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(searchValue.trim().toLowerCase()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, sortValue]);

  const enrichedJobs = useMemo(
    () =>
      jobs.map((job) => {
        const client = getUserById(job.clientId);
        const technician = getUserById(job.technicianId);
        return {
          ...job,
          clientName: client?.name ?? "Unassigned client",
          technicianName: technician?.name ?? "Unassigned technician",
        };
      }),
    [jobs],
  );

  const statusCounts = useMemo(
    () =>
      STATUS_TABS.reduce((acc, status) => {
        acc[status] =
          status === "ALL"
            ? jobs.length
            : jobs.filter((job) => job.status === status).length;
        return acc;
      }, {}),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const tabFiltered =
      activeTab === "ALL"
        ? enrichedJobs
        : enrichedJobs.filter((job) => job.status === activeTab);

    const searched = debouncedSearch
      ? tabFiltered.filter((job) => {
          const haystack = [job.title, job.clientName, job.technicianName]
            .join(" ")
            .toLowerCase();
          return haystack.includes(debouncedSearch);
        })
      : tabFiltered;

    return [...searched].sort((left, right) => {
      if (sortValue === "PRIORITY")
        return (
          (PRIORITY_WEIGHT[right.priority] ?? 0) -
          (PRIORITY_WEIGHT[left.priority] ?? 0)
        );
      if (sortValue === "JOB_NUMBER")
        return right.jobNumber.localeCompare(left.jobNumber);
      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });
  }, [activeTab, debouncedSearch, enrichedJobs, sortValue]);

  const totalJobs = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalJobs);
  const visibleJobs = filteredJobs.slice(startIndex, endIndex);
  const fromCount = totalJobs === 0 ? 0 : startIndex + 1;

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="jobs"
      onRetry={refetch}
      skeleton={() => <AllJobsSkeleton />}
      className="min-h-screen bg-brand-bg"
    >
      <div className="min-h-screen bg-brand-bg px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Page header */}
          <header className="fs-card px-5 py-5">
            <p className="fs-page-title">All Jobs</p>
            <p className="mt-1 text-[13px] text-gray-500">
              Filter, search, sort, and review every job in one place.
            </p>
          </header>

          {/* Filters + table card */}
          <section className="fs-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Status tabs */}
              <div className="flex flex-wrap gap-1.5">
                {STATUS_TABS.map((status) => {
                  const label =
                    status === "ALL"
                      ? "All"
                      : status
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                  const isActive = activeTab === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveTab(status)}
                      className={`rounded-button border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                        isActive
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-black/8 bg-white text-gray-600 hover:border-brand-accent hover:text-brand-accent"
                      }`}
                    >
                      {label}{" "}
                      <span className="ml-0.5 opacity-60">
                        ({statusCounts[status] ?? 0})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search + sort */}
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
                <label className="relative w-full lg:w-80">
                  <span className="sr-only">Search jobs</span>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search jobs, clients, or technicians"
                    className="fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white pl-9 pr-4 text-gray-900 outline-none transition"
                  />
                </label>

                <label className="relative w-full lg:w-52">
                  <span className="sr-only">Sort jobs</span>
                  <select
                    value={sortValue}
                    onChange={(event) => setSortValue(event.target.value)}
                    className="fs-input fs-focus-ring w-full appearance-none rounded-input border border-black/8 bg-white pr-10 text-gray-900 outline-none transition"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={15}
                  />
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-card border border-black/5">
              {visibleJobs.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="No jobs match your filters"
                  subtitle={
                    jobs.length === 0
                      ? "Create a job to get started."
                      : "Try a different tab or search term."
                  }
                  action={
                    jobs.length === 0
                      ? { to: "/admin/jobs/new", label: "Create Job" }
                      : undefined
                  }
                />
              ) : (
                <Table
                  jobs={visibleJobs}
                  onVerifyClick={setVerifyTarget}
                  showFooter={false}
                />
              )}
            </div>

            {/* Pagination footer — 52px tall per spec */}
            <div
              className="flex items-center justify-between px-4"
              style={{ height: "52px", borderTop: "1px solid #F1F5F9" }}
            >
              {/* Count */}
              <p className="text-[12px] text-[#94A3B8]">
                Showing {fromCount}–{endIndex} of {totalJobs} jobs
              </p>

              {/* Controls: Prev · page numbers · Next */}
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex h-8 items-center rounded-button px-3 text-[12px] font-medium text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {/* Page number squares: 32×32, 8px radius */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className="flex h-8 w-8 items-center justify-center rounded-button text-[12px] font-medium transition-colors"
                      style={
                        page === safePage
                          ? { background: "#EFF6FF", color: "#1E3A5F" }
                          : { color: "#64748B" }
                      }
                      onMouseEnter={(e) => {
                        if (page !== safePage)
                          e.currentTarget.style.background = "#F1F5F9";
                      }}
                      onMouseLeave={(e) => {
                        if (page !== safePage)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage >= totalPages}
                  className="flex h-8 items-center rounded-button px-3 text-[12px] font-medium text-[#64748B] transition-colors hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {verifyTarget && (
        <VerifyModal
          job={verifyTarget}
          onConfirm={() => verifyJob(verifyTarget.id)}
          onReject={() => rejectJob(verifyTarget.id)}
          onClose={() => setVerifyTarget(null)}
        />
      )}
    </AsyncPageContent>
  );
}

function AllJobsSkeleton() {
  return (
    <div
      className="min-h-screen bg-brand-bg px-4 py-6 sm:px-6 lg:px-8"
      aria-hidden
    >
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="fs-card space-y-2 px-5 py-5">
          <SkeletonBlock className="h-7 w-40 rounded-md" />
          <SkeletonBlock className="h-4 w-72 rounded-md" />
        </header>

        <section className="fs-card p-5">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((card) => (
              <div
                key={card}
                className="rounded-card border border-black/6 bg-white p-4"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <SkeletonBlock className="h-4 w-1/3 rounded-md" />
                <SkeletonBlock className="mt-2 h-3 w-1/2 rounded-md" />
                <SkeletonBlock className="mt-3 h-3 w-1/4 rounded-md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
