import { useMemo, useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { MOCK_JOBS, getTechnicians } from "../../shared/utils/mockData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";

const PERIODS = [
  { key: "WEEK", label: "This Week" },
  { key: "MONTH", label: "This Month" },
];

function inPeriod(dateIso, periodKey) {
  const date = new Date(dateIso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return periodKey === "WEEK" ? diffDays <= 7 : diffDays <= 30;
}

function hoursBetween(startIso, endIso) {
  return (new Date(endIso).getTime() - new Date(startIso).getTime()) / 3600000;
}

function resolutionHours(job) {
  const pending = job.statusHistory?.find((e) => e.status === "PENDING");
  const completed = job.statusHistory?.find((e) => e.status === "COMPLETED");
  if (!pending || !completed) return null;
  return hoursBetween(pending.changedAt, completed.changedAt);
}

export default function Analytics() {
  const { loading, error, refetch } = useAdminData();
  const [period, setPeriod] = useState("WEEK");

  const analytics = useMemo(() => {
    // TODO: replace with Apollo useQuery once backend is ready
    const jobs = MOCK_JOBS.filter((job) =>
      inPeriod(job.updatedAt, period),
    );
    const technicians = getTechnicians();

    const completed = jobs.filter(
      (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
    );
    const pending = jobs.filter((j) => j.status === "PENDING").length;

    const durations = completed
      .map(resolutionHours)
      .filter((h) => h != null && h > 0);
    const avgResolution =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    const onTime = completed.filter((job) => {
      const hours = resolutionHours(job);
      return hours != null && hours <= 8;
    }).length;
    const onTimeRate =
      completed.length > 0
        ? Math.round((onTime / completed.length) * 100)
        : 0;

    const completedByTech = technicians.map((tech) => ({
      id: tech.id,
      name: tech.name.split(" ")[0],
      count: completed.filter((j) => j.technicianId === tech.id).length,
    }));

    const avgByTech = technicians.map((tech) => {
      const techJobs = completed.filter((j) => j.technicianId === tech.id);
      const techDurations = techJobs
        .map(resolutionHours)
        .filter((h) => h != null && h > 0);
      const avg =
        techDurations.length > 0
          ? techDurations.reduce((a, b) => a + b, 0) / techDurations.length
          : 0;
      return { id: tech.id, name: tech.name.split(" ")[0], avg };
    });

    const teamAvg =
      avgByTech.filter((t) => t.avg > 0).length > 0
        ? avgByTech.reduce((sum, t) => sum + t.avg, 0) /
          avgByTech.filter((t) => t.avg > 0).length
        : 0;

    const maxCompleted = Math.max(...completedByTech.map((t) => t.count), 1);
    const maxAvg = Math.max(...avgByTech.map((t) => t.avg), 1);

    return {
      completedCount: completed.length,
      avgResolution,
      pending,
      onTimeRate,
      completedByTech,
      avgByTech,
      teamAvg,
      maxCompleted,
      maxAvg,
    };
  }, [period]);

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="analytics"
      onRetry={refetch}
      className="min-h-screen bg-[#f5f2ee]"
    >
      <div className="min-h-screen bg-[#f5f2ee] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-4xl bg-white px-5 py-5 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
            <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-700">
              Performance insights calculated from job data.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PERIODS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    period === key
                      ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                      : "border-slate-200 bg-white text-gray-700 hover:border-[#2E86AB]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              label="Jobs Completed"
              value={analytics.completedCount}
            />
            <KpiTile
              label="Avg Resolution Time"
              value={`${analytics.avgResolution.toFixed(1)}h`}
            />
            <KpiTile label="Pending Jobs" value={analytics.pending} />
            <KpiTile
              label="On-time Rate"
              value={`${analytics.onTimeRate}%`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Jobs Completed per Technician">
              <BarChart
                items={analytics.completedByTech}
                valueKey="count"
                max={analytics.maxCompleted}
                barClass="fill-[#2E86AB]"
              />
            </ChartCard>
            <ChartCard title="Avg Resolution Time per Technician">
              <BarChart
                items={analytics.avgByTech}
                valueKey="avg"
                max={analytics.maxAvg}
                barClass="fill-[#1E3A5F]"
                formatValue={(v) => `${v.toFixed(1)}h`}
                highlight={(item) => item.avg > analytics.teamAvg}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </AsyncPageContent>
  );
}

function KpiTile({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-[#1E3A5F]">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-4xl bg-white p-5 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function BarChart({
  items,
  valueKey,
  max,
  barClass,
  formatValue = (v) => v,
  highlight = () => false,
}) {
  const chartHeight = 160;

  return (
    <svg
      viewBox={`0 0 400 ${chartHeight + 40}`}
      className="w-full"
      role="img"
      aria-label="Bar chart"
    >
      {items.map((item, index) => {
        const value = item[valueKey];
        const barHeight = max > 0 ? (value / max) * chartHeight : 0;
        const x = 20 + index * (360 / Math.max(items.length, 1));
        const width = 360 / Math.max(items.length, 1) - 12;
        const isHighlight = highlight(item);

        return (
          <g key={item.id}>
            <rect
              x={x}
              y={chartHeight - barHeight}
              width={width}
              height={barHeight}
              rx={6}
              className={isHighlight ? "fill-amber-400" : barClass}
            />
            <text
              x={x + width / 2}
              y={chartHeight + 16}
              textAnchor="middle"
              className="fill-gray-600 text-[10px]"
            >
              {item.name}
            </text>
            <text
              x={x + width / 2}
              y={chartHeight - barHeight - 6}
              textAnchor="middle"
              className="fill-gray-700 text-[10px] font-medium"
            >
              {formatValue(value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
