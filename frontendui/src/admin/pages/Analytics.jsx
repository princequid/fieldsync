import { useMemo, useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { MOCK_JOBS, getTechnicians } from "../../shared/utils/mockData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";

const PERIODS = [
  { key: "WEEK", label: "This Week" },
  { key: "MONTH", label: "This Month" },
];

function inPeriod(dateIso, periodKey) {
  const diff = (Date.now() - new Date(dateIso).getTime()) / 86400000;
  return periodKey === "WEEK" ? diff <= 7 : diff <= 30;
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
    const jobs = MOCK_JOBS.filter((job) => inPeriod(job.updatedAt, period));
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
      const h = resolutionHours(job);
      return h != null && h <= 8;
    }).length;
    const onTimeRate =
      completed.length > 0 ? Math.round((onTime / completed.length) * 100) : 0;

    const completedByTech = technicians.map((tech) => ({
      id: tech.id,
      name: tech.name.split(" ")[0],
      count: completed.filter((j) => j.technicianId === tech.id).length,
    }));

    const avgByTech = technicians.map((tech) => {
      const techJobs = completed.filter((j) => j.technicianId === tech.id);
      const techDurs = techJobs
        .map(resolutionHours)
        .filter((h) => h != null && h > 0);
      const avg =
        techDurs.length > 0
          ? techDurs.reduce((a, b) => a + b, 0) / techDurs.length
          : 0;
      return { id: tech.id, name: tech.name.split(" ")[0], avg };
    });

    const teamAvg =
      avgByTech.filter((t) => t.avg > 0).length > 0
        ? avgByTech.reduce((s, t) => s + t.avg, 0) /
          avgByTech.filter((t) => t.avg > 0).length
        : 0;

    return {
      completedCount: completed.length,
      avgResolution,
      pending,
      onTimeRate,
      completedByTech,
      avgByTech,
      teamAvg,
      maxCompleted: Math.max(...completedByTech.map((t) => t.count), 1),
      maxAvg: Math.max(...avgByTech.map((t) => t.avg), 1),
    };
  }, [period]);

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="analytics"
      onRetry={refetch}
      className="min-h-screen bg-brand-bg"
    >
      <div className="min-h-screen bg-brand-bg px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Header */}
          <header className="fs-card px-5 py-5">
            <h1 className="fs-page-title">Analytics</h1>
            <p className="mt-1 text-[13px] text-gray-500">
              Performance insights calculated from job data.
            </p>
            <div className="mt-4 flex gap-1.5">
              {PERIODS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`rounded-button border px-4 py-2 text-[12px] font-medium transition ${
                    period === key
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-black/8 bg-white text-gray-600 hover:border-brand-accent hover:text-brand-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {/* KPI tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile label="Jobs Completed" value={analytics.completedCount} />
            <KpiTile
              label="Avg Resolution Time"
              value={`${analytics.avgResolution.toFixed(1)}h`}
            />
            <KpiTile label="Pending Jobs" value={analytics.pending} />
            <KpiTile label="On-time Rate" value={`${analytics.onTimeRate}%`} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChartCard title="Jobs Completed per Technician">
              <BarChart
                items={analytics.completedByTech}
                valueKey="count"
                max={analytics.maxCompleted}
                barColor="#2e86ab"
              />
            </ChartCard>
            <ChartCard title="Avg Resolution Time per Technician">
              <BarChart
                items={analytics.avgByTech}
                valueKey="avg"
                max={analytics.maxAvg}
                barColor="#1e3a5f"
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
    <div className="fs-card p-5">
      <p className="fs-label text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="fs-card overflow-hidden rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#0F172A]">
            {title}
          </h2>
          <p className="mt-1 text-[12px] text-[#94A3B8]">
            Clear, comparable performance by technician.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-[11px] font-medium text-[#64748B] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#2577A3]" aria-hidden />
          Live data
        </div>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

function BarChart({
  items,
  valueKey,
  max,
  barColor,
  formatValue = (v) => v,
  highlight = () => false,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartWidth = 640;
  const chartHeight = 260;
  const margins = { top: 18, right: 22, bottom: 52, left: 44 };
  const innerWidth = chartWidth - margins.left - margins.right;
  const innerHeight = chartHeight - margins.top - margins.bottom;
  const step = innerWidth / Math.max(items.length, 1);
  const barWidth = Math.min(32, Math.max(18, step * 0.48));
  const gridTicks = 4;

  function getScaledValue(value) {
    return max > 0 ? (value / max) * innerHeight : 0;
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-[16/8.2] w-full min-h-55 sm:min-h-60 lg:min-h-65">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-full w-full"
          role="img"
          aria-label="Bar chart showing technician performance"
          preserveAspectRatio="none"
        >
          <title>Technician performance bar chart</title>
          <defs>
            <linearGradient id="fs-bar-blue" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2577A3" />
              <stop offset="100%" stopColor="#1B6289" />
            </linearGradient>
            <linearGradient id="fs-bar-navy" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#162D4A" />
            </linearGradient>
          </defs>

          {/* Grid and axes */}
          <g aria-hidden>
            {Array.from({ length: gridTicks + 1 }, (_, index) => {
              const y = margins.top + (innerHeight / gridTicks) * index;
              return (
                <g key={index}>
                  <line
                    x1={margins.left}
                    y1={y}
                    x2={chartWidth - margins.right}
                    y2={y}
                    stroke={index === gridTicks ? "#E2E8F0" : "#F1F5F9"}
                    strokeWidth={1}
                  />
                  <text
                    x={margins.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="#94A3B8"
                    fontSize="10"
                    fontWeight="500"
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                  >
                    {Math.round(max - (max / gridTicks) * index)}
                  </text>
                </g>
              );
            })}
          </g>

          <line
            x1={margins.left}
            y1={chartHeight - margins.bottom}
            x2={chartWidth - margins.right}
            y2={chartHeight - margins.bottom}
            stroke="#CBD5E1"
            strokeWidth={1}
          />
          <line
            x1={margins.left}
            y1={margins.top}
            x2={margins.left}
            y2={chartHeight - margins.bottom}
            stroke="#E2E8F0"
            strokeWidth={1}
          />

          {items.map((item, index) => {
            const value = item[valueKey];
            const barHeight = getScaledValue(value);
            const slotLeft = margins.left + step * index;
            const x = slotLeft + (step - barWidth) / 2;
            const y = chartHeight - margins.bottom - barHeight;
            const fill = highlight(item)
              ? "url(#fs-bar-navy)"
              : barColor === "#1e3a5f"
                ? "url(#fs-bar-navy)"
                : "url(#fs-bar-blue)";
            const isHovered = hoveredIndex === index;

            return (
              <g key={item.id}>
                <title>{`${item.name}: ${formatValue(value)}`}</title>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="10"
                  fill={fill}
                  opacity={isHovered ? 1 : 0.92}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center bottom",
                    transition:
                      "transform 180ms ease, opacity 180ms ease, filter 180ms ease",
                    filter: isHovered
                      ? "drop-shadow(0 10px 16px rgba(15,23,42,0.18))"
                      : "none",
                    transform: isHovered ? "scaleY(1.03)" : "scaleY(1)",
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                <text
                  x={slotLeft + step / 2}
                  y={chartHeight - margins.bottom + 18}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                >
                  {item.name}
                </text>

                <text
                  x={slotLeft + step / 2}
                  y={Math.max(y - 8, margins.top + 12)}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                  opacity={isHovered || value > 0 ? 1 : 0.92}
                >
                  {formatValue(value)}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex != null && items[hoveredIndex] && (
          <div
            className="pointer-events-none absolute inset-x-0 top-3 flex justify-center"
            aria-hidden
          >
            <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
              <p className="text-[11px] font-semibold text-[#0F172A]">
                {items[hoveredIndex].name}
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                {formatValue(items[hoveredIndex][valueKey])}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
