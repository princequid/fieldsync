import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import { getUserById } from "../../shared/utils/mockData";
import Table from "../../admin/components/Table";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import EmptyState from "../../shared/components/EmptyState";
import VerifyModal from "../components/modals/VerifyModal";

const PAGE_SIZE = 20;

const STATUS_TABS = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"];

const SORT_OPTIONS = [
  { value: "LAST_UPDATED", label: "Last Updated" },
  { value: "PRIORITY", label: "Priority (High first)" },
  { value: "JOB_NUMBER", label: "Job Number" },
];

const PRIORITY_WEIGHT = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export default function AllJobs() {
  const { jobs, verifyJob, rejectJob, loading, error, refetch } = useAdminData();
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
      STATUS_TABS.reduce((accumulator, status) => {
        accumulator[status] =
          status === "ALL"
            ? jobs.length
            : jobs.filter((job) => job.status === status).length;
        return accumulator;
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

    const sorted = [...searched].sort((left, right) => {
      if (sortValue === "PRIORITY") {
        return (
          (PRIORITY_WEIGHT[right.priority] ?? 0) -
          (PRIORITY_WEIGHT[left.priority] ?? 0)
        );
      }

      if (sortValue === "JOB_NUMBER") {
        return right.jobNumber.localeCompare(left.jobNumber);
      }

      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });

    return sorted;
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
      className="min-h-screen bg-[#f5f2ee]"
    >
      <div className="min-h-screen bg-[#f5f2ee] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-4xl bg-white px-5 py-5 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
            <p className="text-xl font-bold text-gray-900">All Jobs</p>
            <p className="mt-1 text-sm text-gray-700">
              Filter, search, sort, and review every job in one place.
            </p>
          </header>

          <section className="rounded-4xl bg-white p-5 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {STATUS_TABS.map((status) => {
                  const label =
                    status === "ALL"
                      ? "All"
                      : status
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (character) =>
                            character.toUpperCase(),
                          );
                  const isActive = activeTab === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveTab(status)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                          : "border-slate-200 bg-white text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                      }`}
                    >
                      {label}{" "}
                      <span className="ml-1 text-xs opacity-80">
                        ({statusCounts[status] ?? 0})
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative w-full lg:w-96">
                  <span className="sr-only">Search jobs</span>
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search jobs, clients, or technicians"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
                  />
                </label>

                <label className="relative w-full lg:w-56">
                  <span className="sr-only">Sort jobs</span>
                  <select
                    value={sortValue}
                    onChange={(event) => setSortValue(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
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

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Showing {fromCount}-{endIndex} of {totalJobs} jobs
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage === 1}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={safePage >= totalPages}
                  className="rounded-full bg-[#1E3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#17304d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      {verifyTarget ? (
        <VerifyModal
          job={verifyTarget}
          onConfirm={() => verifyJob(verifyTarget.id)}
          onReject={() => rejectJob(verifyTarget.id)}
          onClose={() => setVerifyTarget(null)}
        />
      ) : null}
    </AsyncPageContent>
  );
}
