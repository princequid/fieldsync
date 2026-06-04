import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import { AnalyticsPageSkeleton } from "../../shared/components/skeletons/PageSkeletons";
import { useTheme } from "../../shared/context/ThemeContext";

const PERIODS = [
  { key: "WEEK", label: "This Week" },
  { key: "MONTH", label: "This Month" },
];

const CHART_COLORS = {
  accent: "#2E86AB",
  accentDark: "#1d6f94",
  navy: "#1E3A5F",
  navyDark: "#162d4a",
  grid: "#F1F5F9",
  axis: "#94A3B8",
  tooltipBorder: "#E5E7EB",
};

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
  const { jobs: allJobs, technicians: allTechnicians, loading, error, refetch } = useAdminData();
  const { theme } = useTheme();
  const [period, setPeriod] = useState("WEEK");
  const isDark = theme === "dark";
  const chartColors = isDark
    ? {
        ...CHART_COLORS,
        grid: "#1f2937",
        axis: "#9ca3af",
        tooltipBorder: "#374151",
      }
    : CHART_COLORS;

  const analytics = useMemo(() => {
    const jobs = allJobs.filter((job) => inPeriod(job.updatedAt, period));
    const technicians = allTechnicians;
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
      fullName: tech.name,
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
      return {
        id: tech.id,
        name: tech.name.split(" ")[0],
        fullName: tech.name,
        avg: Number(avg.toFixed(1)),
      };
    });

    const teamAvg =
      avgByTech.filter((t) => t.avg > 0).length > 0
        ? avgByTech.reduce((s, t) => s + t.avg, 0) /
          avgByTech.filter((t) => t.avg > 0).length
        : 0;

    const tableRows = technicians.map((tech) => {
      const row = completedByTech.find((t) => t.id === tech.id);
      const avgRow = avgByTech.find((t) => t.id === tech.id);
      const techCompleted = completed.filter((j) => j.technicianId === tech.id);
      const onTimeTech = techCompleted.filter((job) => {
        const h = resolutionHours(job);
        return h != null && h <= 8;
      }).length;
      const rate =
        techCompleted.length > 0
          ? Math.round((onTimeTech / techCompleted.length) * 100)
          : 0;

      return {
        id: tech.id,
        name: tech.name,
        initials: tech.initials,
        completed: row?.count ?? 0,
        avgHours: avgRow?.avg ?? 0,
        onTimeRate: rate,
      };
    });

    return {
      completedCount: completed.length,
      avgResolution,
      pending,
      onTimeRate,
      completedByTech,
      avgByTech,
      teamAvg: Number(teamAvg.toFixed(1)),
      tableRows,
    };
  }, [period]);

  const periodLabel =
    PERIODS.find((p) => p.key === period)?.label ?? "This Week";

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="analytics"
      onRetry={refetch}
      skeleton={<AnalyticsPageSkeleton />}
      className="fs-admin-page-bg min-h-full"
    >
      <div className="fs-admin-page-bg space-y-6 p-4 sm:p-6">
        <header className="fs-card overflow-hidden border border-transparent p-5 sm:p-6 dark:border-gray-800/80 dark:bg-gray-900/90 dark:shadow-[0_1px_0_0_rgba(46,134,171,0.08)_inset,0_4px_24px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-accent">
                <BarChart3 size={20} aria-hidden />
                <span className="fs-label text-brand-accent">Insights</span>
              </div>
              <h1 className="fs-page-title mt-2 text-brand-navy dark:text-gray-50">
                Analytics
              </h1>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                Performance metrics for your field team —{" "}
                {periodLabel.toLowerCase()}.
              </p>
            </div>

            <div
              className="inline-flex rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-1 dark:border-gray-700 dark:bg-gray-800/80 dark:shadow-inner dark:shadow-black/20"
              role="group"
              aria-label="Time period"
            >
              {PERIODS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`fs-btn-press min-h-10 rounded-lg px-4 py-2 text-[13px] font-medium transition-all ${
                    period === key
                      ? "bg-brand-navy text-white shadow-sm dark:shadow-[0_2px_8px_rgba(30,58,95,0.5)]"
                      : "text-gray-600 hover:bg-white hover:text-brand-navy dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Jobs Completed"
            value={analytics.completedCount}
            icon={CheckCircle2}
            tone="green"
            hint="Completed or verified in period"
          />
          <KpiCard
            label="Avg Resolution"
            value={`${analytics.avgResolution.toFixed(1)}h`}
            icon={Clock3}
            tone="blue"
            hint="Pending to completed"
          />
          <KpiCard
            label="Pending Jobs"
            value={analytics.pending}
            icon={Users}
            tone="amber"
            hint="Awaiting assignment or start"
          />
          <KpiCard
            label="On-time Rate"
            value={`${analytics.onTimeRate}%`}
            icon={TrendingUp}
            tone="navy"
            hint="Resolved within 8 hours"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
          <ChartPanel
            title="Jobs completed per technician"
            subtitle="Volume of closed work by team member"
            legendColor={CHART_COLORS.accent}
          >
            <ResponsiveBarChart
              data={analytics.completedByTech}
              dataKey="count"
              valueFormatter={(v) => `${v} jobs`}
              barColor={chartColors.accent}
              barColorEnd={chartColors.accentDark}
              colors={chartColors}
            />
          </ChartPanel>

          <ChartPanel
            title="Avg resolution time"
            subtitle={`Team average: ${analytics.teamAvg}h — bars above average highlighted`}
            legendColor={CHART_COLORS.navy}
          >
            <ResponsiveBarChart
              data={analytics.avgByTech}
              dataKey="avg"
              valueFormatter={(v) => `${Number(v).toFixed(1)}h`}
              barColor={chartColors.accent}
              barColorEnd={chartColors.accentDark}
              highlightBar={(entry) => entry.avg > analytics.teamAvg}
              highlightColor={chartColors.navy}
              highlightColorEnd={chartColors.navyDark}
              colors={chartColors}
            />
          </ChartPanel>
        </div>

        <section className="fs-card overflow-hidden border border-transparent dark:border-gray-800/80 dark:bg-gray-900/90 dark:shadow-[0_4px_32px_rgba(0,0,0,0.28)]">
          <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6 dark:border-gray-700/80">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
              Technician performance
            </h2>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              Side-by-side comparison for {periodLabel.toLowerCase()}
            </p>
          </div>
          <div className="overflow-x-auto dark:bg-gray-950/30">
            <table className="w-full min-w-160 text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] dark:border-gray-700 dark:bg-gray-800/90">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 sm:px-6">
                    Technician
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400">
                    Avg time
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-gray-400 sm:px-6">
                    On-time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6] dark:divide-gray-800">
                {analytics.tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-gray-800/70"
                  >
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-accent text-xs font-bold text-white">
                          {row.initials}
                        </span>
                        <span className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">
                      {row.completed}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">
                      {row.avgHours > 0 ? `${row.avgHours}h` : "—"}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6">
                      <OnTimeBadge rate={row.onTimeRate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AsyncPageContent>
  );
}

const KPI_TONES = {
  green: {
    icon: "bg-green-50 text-green-600 dark:bg-green-900/35 dark:text-green-400",
    ring: "hover:border-green-200 dark:hover:border-green-800",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/35 dark:text-blue-400",
    ring: "hover:border-blue-200 dark:hover:border-blue-800",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-900/35 dark:text-amber-400",
    ring: "hover:border-amber-200 dark:hover:border-amber-800",
  },
  navy: {
    icon: "bg-slate-100 text-brand-navy dark:bg-slate-800 dark:text-slate-300",
    ring: "hover:border-brand-navy/20 dark:hover:border-gray-600",
  },
};

function KpiCard({ label, value, icon: Icon, tone, hint }) {
  const styles = KPI_TONES[tone] ?? KPI_TONES.navy;

  return (
    <article
      className={`fs-card group border border-transparent p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(30,58,95,0.08)] dark:border-gray-800/60 dark:shadow-[0_4px_20px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)] ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="fs-label text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy dark:text-gray-50 sm:text-3xl">
            {value}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-gray-400 dark:text-gray-500">
            {hint}
          </p>
        </div>
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${styles.icon}`}
        >
          <Icon size={20} aria-hidden />
        </span>
      </div>
    </article>
  );
}

function ChartPanel({ title, subtitle, legendColor, children }) {
  return (
    <section className="fs-card flex flex-col overflow-hidden border border-transparent transition-shadow duration-200 hover:shadow-[0_4px_14px_rgba(30,58,95,0.06)] dark:border-gray-800/80 dark:bg-gray-900/90 dark:shadow-[0_4px_24px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_6px_28px_rgba(0,0,0,0.32)]">
      <div className="border-b border-[#F3F4F6] px-5 py-4 sm:px-6 dark:border-gray-700/80">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: legendColor }}
              aria-hidden
            />
            Live
          </span>
        </div>
      </div>
      <div className="h-63 w-full px-2 pb-4 pt-3 sm:h-70 sm:px-4">
        {children}
      </div>
    </section>
  );
}

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;

  const displayLabel =
    label ?? payload[0]?.payload?.fullName ?? payload[0]?.payload?.name;

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30">
      <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">
        {displayLabel}
      </p>
      <p className="mt-0.5 text-[12px] font-medium text-brand-accent">
        {valueFormatter(payload[0].value)}
      </p>
    </div>
  );
}

function ResponsiveBarChart({
  data,
  dataKey,
  valueFormatter,
  barColor,
  barColorEnd,
  highlightBar,
  highlightColor = CHART_COLORS.navy,
  highlightColorEnd = CHART_COLORS.navyDark,
  colors = CHART_COLORS,
}) {
  const chartData = data.map((d) => ({
    ...d,
    label: d.name,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-55 items-center justify-center text-[13px] text-gray-400 dark:text-gray-500">
        No data for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
        barCategoryGap="28%"
      >
        <defs>
          <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColor} />
            <stop offset="100%" stopColor={barColorEnd} />
          </linearGradient>
          <linearGradient id="gradNavy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="100%" stopColor={highlightColorEnd} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 4"
          stroke={colors.grid}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: colors.axis, fontSize: 11, fontWeight: 500 }}
          axisLine={{ stroke: colors.tooltipBorder }}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: colors.axis, fontSize: 10, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          width={40}
          allowDecimals={dataKey === "avg"}
        />
        <Tooltip
          cursor={{ fill: "rgba(46, 134, 171, 0.06)", radius: 8 }}
          content={<ChartTooltip valueFormatter={valueFormatter} />}
        />
        <Bar
          dataKey={dataKey}
          radius={[8, 8, 0, 0]}
          maxBarSize={44}
          animationDuration={400}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${entry.id ?? index}`}
              fill={
                highlightBar?.(entry) ? "url(#gradNavy)" : "url(#gradAccent)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function OnTimeBadge({ rate }) {
  let cls = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  if (rate >= 80)
    cls = "bg-green-50 text-green-700 dark:bg-green-900/35 dark:text-green-300";
  else if (rate >= 50)
    cls = "bg-amber-50 text-amber-700 dark:bg-amber-900/35 dark:text-amber-300";
  else if (rate > 0)
    cls = "bg-red-50 text-red-600 dark:bg-red-900/35 dark:text-red-300";

  return (
    <span
      className={`inline-flex min-w-13 justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {rate}%
    </span>
  );
}
