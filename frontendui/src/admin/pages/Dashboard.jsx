import { useMemo, useState } from "react";
import { Briefcase, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import VerifyModal from "../components/modals/VerifyModal";
import EmptyState from "../../shared/components/EmptyState";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import { DashboardPageSkeleton } from "../../shared/components/skeletons/PageSkeletons";

function buildStatCards(jobs) {
  return [
    {
      key: "PENDING",
      label: "Pending",
      value: jobs.filter((j) => j.status === "PENDING").length,
      icon: Clock3,
      color: "amber",
      trend: { text: "Awaiting assignment" },
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      value: jobs.filter((j) => j.status === "IN_PROGRESS").length,
      icon: Briefcase,
      color: "blue",
      trend: { text: "Active on site" },
    },
    {
      key: "COMPLETED",
      label: "Completed",
      value: jobs.filter((j) => j.status === "COMPLETED").length,
      icon: CheckCircle2,
      color: "green",
      trend: { text: "Needs verification" },
    },
    {
      key: "VERIFIED",
      label: "Verified",
      value: jobs.filter((j) => j.status === "VERIFIED").length,
      icon: ShieldCheck,
      color: "navy",
      trend: { text: "Closed this period" },
    },
  ];
}

const STATUS_SEGMENTS = [
  {
    status: "PENDING",
    label: "Pending",
    color: "#f59e0b",
    gradient: ["#fbbf24", "#d97706"],
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    color: "#3b82f6",
    gradient: ["#60a5fa", "#2563eb"],
  },
  {
    status: "COMPLETED",
    label: "Completed",
    color: "#22c55e",
    gradient: ["#4ade80", "#16a34a"],
  },
  {
    status: "VERIFIED",
    label: "Verified",
    color: "#64748b",
    gradient: ["#94a3b8", "#475569"],
  },
];

function JobsByStatusPanel({ jobs, activeStatus, onStatusClick }) {
  const segments = useMemo(() => {
    const counts = STATUS_SEGMENTS.map((seg) => ({
      ...seg,
      count: jobs.filter((j) => j.status === seg.status).length,
    }));
    const total = counts.reduce((sum, s) => sum + s.count, 0);
    return counts.map((seg) => ({
      ...seg,
      total,
      percent: total > 0 ? Math.round((seg.count / total) * 100) : 0,
    }));
  }, [jobs]);

  const total = segments[0]?.total ?? 0;

  return (
    <section className="fs-card overflow-hidden border border-transparent dark:border-gray-800/80 dark:shadow-[0_4px_24px_rgba(0,0,0,0.22)]">
      <div className="border-b border-black/5 px-5 py-4 dark:border-gray-800">
        <h2 className="fs-card-title dark:text-gray-100">Jobs by Status</h2>
        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
          Pipeline distribution · {total} total
        </p>
      </div>

      <div className="p-5">
        <StatusDonutChart segments={segments} total={total} />

        <ul className="mt-5 space-y-2">
          {segments.map((seg) => {
            const isActive = activeStatus === seg.status;
            return (
              <li key={seg.status}>
                <button
                  type="button"
                  onClick={() => onStatusClick?.(seg.status)}
                  className={`group w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
                    isActive
                      ? "border-brand-accent/40 bg-brand-accent/5 shadow-sm dark:border-brand-accent/30 dark:bg-brand-accent/10"
                      : "border-transparent bg-[#F8FAFC] hover:border-black/5 hover:bg-white dark:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900"
                        style={{ backgroundColor: seg.color }}
                        aria-hidden
                      />
                      <span className="truncate text-[12px] font-medium text-gray-700 dark:text-gray-200">
                        {seg.label}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-[13px] font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                        {seg.count}
                      </span>
                      <span className="text-[10px] font-medium tabular-nums text-gray-400 dark:text-gray-500">
                        {seg.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-700/80">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${seg.percent}%`,
                        background: `linear-gradient(90deg, ${seg.gradient[0]}, ${seg.gradient[1]})`,
                      }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function StatusDonutChart({ segments, total }) {
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const gap = total > 0 ? 3 : 0;
  const activeSegments = segments.filter((s) => s.count > 0);

  let offset = 0;

  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
      <div
        className="absolute inset-3 rounded-full bg-gradient-to-br from-[#F8FAFC] to-white shadow-inner dark:from-gray-800/80 dark:to-gray-900/90"
        aria-hidden
      />
      <svg
        viewBox="0 0 140 140"
        className="relative h-full w-full -rotate-90"
        aria-hidden
      >
        <defs>
          {STATUS_SEGMENTS.map((seg) => (
            <linearGradient
              key={seg.status}
              id={`donut-${seg.status}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={seg.gradient[0]} />
              <stop offset="100%" stopColor={seg.gradient[1]} />
            </linearGradient>
          ))}
        </defs>

        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          className="stroke-[#eef2f7] dark:stroke-gray-700/90"
          strokeWidth={strokeWidth}
        />

        {total === 0 ? (
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={strokeWidth}
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        ) : (
          activeSegments.map((seg) => {
            const raw = (seg.count / total) * circumference;
            const dash = Math.max(raw - gap, 0);
            const el = (
              <circle
                key={seg.status}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={`url(#donut-${seg.status})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700 ease-out"
              />
            );
            offset += raw;
            return el;
          })
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-bold leading-none tracking-tight text-brand-navy dark:text-gray-50">
          {total}
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
          {total === 1 ? "Job" : "Jobs"}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { jobs, technicians, loading, error, refetch, verifyJob, rejectJob } =
    useAdminData();
  const [statusFilter, setStatusFilter] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);

  const statCards = useMemo(() => buildStatCards(jobs), [jobs]);

  const activeTechnicians = useMemo(
    () =>
      technicians.filter(
        (t) =>
          jobs.some(
            (j) =>
              j.technicianId === t.id &&
              (j.status === "IN_PROGRESS" || j.status === "PENDING"),
          ) || t.online,
      ),
    [technicians, jobs],
  );

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="dashboard"
      onRetry={refetch}
      skeleton={() => <DashboardPageSkeleton />}
      className="min-h-full"
    >
      <div className="min-h-full p-6 dark:bg-gray-950 fs-content-settled">
      <div className="space-y-6">
        {/* Page header */}
        <header>
          <h1 className="fs-page-title">Dashboard</h1>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            Overview of field operations across Accra &amp; Tema.
          </p>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StatCard
              key={card.key}
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
              trend={card.trend}
              onClick={() =>
                setStatusFilter((current) =>
                  current === card.key ? null : card.key,
                )
              }
            />
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-5 xl:flex">
          {/* Recent Jobs table */}
          <section className="fs-card overflow-hidden xl:min-w-0 xl:flex-1">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-gray-800">
              <h2 className="fs-card-title">
                Recent Jobs
                {statusFilter ? (
                  <span className="ml-2 font-normal text-gray-400">
                    · {statusFilter.replaceAll("_", " ")}
                  </span>
                ) : null}
              </h2>
              {statusFilter && (
                <button
                  type="button"
                  onClick={() => setStatusFilter(null)}
                  className="text-[11px] font-medium text-brand-accent hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            {jobs.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No jobs yet"
                subtitle="Create your first job to start tracking field work."
                action={{ to: "/admin/jobs/new", label: "Create Job" }}
              />
            ) : (
              <Table
                jobs={jobs}
                limit={10}
                showFooter
                statusFilter={statusFilter}
                onVerifyClick={setVerifyTarget}
                onVerify={verifyJob}
              />
            )}
          </section>

          {/* Right sidebar panels */}
          <div className="space-y-4 xl:w-68 xl:shrink-0">
            <JobsByStatusPanel
              jobs={jobs}
              activeStatus={statusFilter}
              onStatusClick={(status) =>
                setStatusFilter((current) =>
                  current === status ? null : status,
                )
              }
            />

            {/* Active technicians */}
            <section className="fs-card p-5">
              <h2 className="fs-card-title">Active Technicians</h2>
              <ul className="mt-4 space-y-2">
                {activeTechnicians.length === 0 ? (
                  <li className="text-[13px] text-gray-400">
                    No active technicians
                  </li>
                ) : (
                  activeTechnicians.map((tech) => {
                    const activeCount = jobs.filter(
                      (j) =>
                        j.technicianId === tech.id &&
                        (j.status === "IN_PROGRESS" || j.status === "PENDING"),
                    ).length;
                    return (
                      <li
                        key={tech.id}
                        className="flex items-center justify-between gap-2 rounded-card px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-accent text-[11px] font-bold text-white">
                            {tech.initials}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                              {tech.name}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {tech.online ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-badge bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-blue-900/30 dark:text-blue-300">
                          {activeCount} jobs
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>
          </div>
        </div>
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
