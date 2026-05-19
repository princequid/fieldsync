import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import VerifyModal from "../components/modals/VerifyModal";
import Loader from "../../shared/components/Loader";
import ErrorState from "../../shared/components/ErrorState";
import EmptyState from "../../shared/components/EmptyState";
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
        stroke="#e2e8f0"
        strokeWidth="14"
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
            strokeWidth="14"
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
        y="68"
        textAnchor="middle"
        className="fill-[#1E3A5F] text-xl font-bold"
        fontSize="20"
      >
        {jobs.length}
      </text>
      <text
        x="70"
        y="86"
        textAnchor="middle"
        className="fill-gray-500"
        fontSize="10"
      >
        Total Jobs
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const {
    jobs,
    technicians,
    loading,
    error,
    refetch,
    verifyJob,
    rejectJob,
  } = useAdminData();
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

  if (loading) return <Loader centered />;
  if (error) {
    return (
      <ErrorState thing="dashboard" message={error} onRetry={refetch} />
    );
  }

  return (
    <div className="min-h-full p-6">
      <div className="space-y-6">
        <header>
          <h1 className="fs-page-title text-[#1E3A5F]">Dashboard</h1>
          <p className="mt-1 text-[13px] text-gray-600">
            Overview of field operations across Accra &amp; Tema.
          </p>
        </header>

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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="fs-card overflow-hidden xl:col-span-2">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
              <h2 className="fs-card-title font-semibold text-gray-900">
                Recent Jobs
                {statusFilter
                  ? ` · ${statusFilter.replaceAll("_", " ")}`
                  : ""}
              </h2>
              {statusFilter ? (
                <button
                  type="button"
                  onClick={() => setStatusFilter(null)}
                  className="text-xs font-medium text-[#2E86AB] hover:underline"
                >
                  Clear filter
                </button>
              ) : null}
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

          <aside className="w-full space-y-4 xl:w-72 min-[1280px]:w-[260px]">
            <section className="fs-card p-5">
              <h2 className="fs-card-title font-semibold text-gray-900">
                Jobs by Status
              </h2>
              <StatusDonut jobs={jobs} />
              <ul className="mt-4 space-y-2 text-xs text-gray-600">
                {[
                  ["Pending", "#f59e0b"],
                  ["In Progress", "#3b82f6"],
                  ["Completed", "#22c55e"],
                  ["Verified", "#64748b"],
                ].map(([label, color]) => (
                  <li key={label} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            <section className="fs-card p-5">
              <h2 className="fs-card-title font-semibold text-gray-900">
                Active Technicians
              </h2>
              <ul className="mt-4 space-y-3">
                {activeTechnicians.length === 0 ? (
                  <li className="text-sm text-gray-500">No active technicians</li>
                ) : (
                  activeTechnicians.map((tech) => {
                    const activeCount = jobs.filter(
                      (j) =>
                        j.technicianId === tech.id &&
                        (j.status === "IN_PROGRESS" ||
                          j.status === "PENDING"),
                    ).length;
                    return (
                      <li
                        key={tech.id}
                        className="flex items-center justify-between gap-2 rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2E86AB] text-xs font-bold text-white">
                            {tech.initials}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {tech.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tech.online ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          {activeCount} jobs
                        </span>
                      </li>
                    );
                  })
                )}
              </ul>
            </section>
          </aside>
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
    </div>
  );
}
