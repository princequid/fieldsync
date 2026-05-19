import { useMemo, useState } from "react";
import { Briefcase, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import VerifyModal from "../components/modals/VerifyModal";
import ErrorState from "../../shared/components/ErrorState";
import EmptyState from "../../shared/components/EmptyState";
import { SkeletonBlock } from "../../shared/components/Skeleton";

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

function StatusDonut({ jobs }) {
  const segments = [
    { status: "PENDING", color: "#f59e0b", count: 0 },
    { status: "IN_PROGRESS", color: "#3b82f6", count: 0 },
    { status: "COMPLETED", color: "#22c55e", count: 0 },
    { status: "VERIFIED", color: "#64748b", count: 0 },
  ];

  jobs.forEach((job) => {
    const seg = segments.find((s) => s.status === job.status);
    if (seg) seg.count += 1;
  });

  const total = segments.reduce((sum, s) => sum + s.count, 0) || 1;
  let offset = 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-36 w-36">
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="13"
      />
      {segments.map((seg) => {
        const dash = (seg.count / total) * circumference;
        const el = (
          <circle
            key={seg.status}
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 70 70)"
          />
        );
        offset += dash;
        return el;
      })}
      <text
        x="70"
        y="67"
        textAnchor="middle"
        fill="#1e3a5f"
        fontSize="20"
        fontWeight="700"
      >
        {jobs.length}
      </text>
      <text x="70" y="82" textAnchor="middle" fill="#9ca3af" fontSize="9">
        Total Jobs
      </text>
    </svg>
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

  if (loading) return <DashboardSkeleton />;
  if (error)
    return <ErrorState thing="dashboard" message={error} onRetry={refetch} />;

  return (
    <div className="min-h-full p-6">
      <div className="space-y-6">
        {/* Page header */}
        <header>
          <h1 className="fs-page-title">Dashboard</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Overview of field operations across Accra &amp; Tema.
          </p>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
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
            {/* Donut chart */}
            <section className="fs-card p-5">
              <h2 className="fs-card-title">Jobs by Status</h2>
              <div className="mt-4">
                <StatusDonut jobs={jobs} />
              </div>
              <ul className="mt-4 space-y-2">
                {[
                  ["Pending", "#f59e0b"],
                  ["In Progress", "#3b82f6"],
                  ["Completed", "#22c55e"],
                  ["Verified", "#64748b"],
                ].map(([label, color]) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-[12px] text-gray-500"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </section>

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
                        className="flex items-center justify-between gap-2 rounded-card px-2 py-2 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-accent text-[11px] font-bold text-white">
                            {tech.initials}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">
                              {tech.name}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {tech.online ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-badge bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
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

      {verifyTarget && (
        <VerifyModal
          job={verifyTarget}
          onConfirm={() => verifyJob(verifyTarget.id)}
          onReject={() => rejectJob(verifyTarget.id)}
          onClose={() => setVerifyTarget(null)}
        />
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-full p-6" aria-hidden>
      <div className="space-y-6">
        <header className="space-y-2">
          <SkeletonBlock className="h-7 w-40 rounded-md" />
          <SkeletonBlock className="h-4 w-72 rounded-md" />
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="fs-card rounded-card p-5">
              <SkeletonBlock className="h-3 w-20 rounded-md" />
              <SkeletonBlock className="mt-3 h-7 w-12 rounded-md" />
            </div>
          ))}
        </div>

        <section className="fs-card overflow-hidden">
          <div className="border-b border-black/5 px-5 py-4">
            <SkeletonBlock className="h-4 w-32 rounded-md" />
          </div>
          <div className="px-5 py-3">
            <SkeletonBlock className="h-4 w-full rounded-md" />
          </div>
          <div className="space-y-2 px-5 pb-5">
            {[1, 2, 3, 4].map((row) => (
              <SkeletonBlock key={row} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
