import { ArrowRight } from "lucide-react";

const STYLES = {
  amber: {
    /* card bg: subtle gradient per spec */
    cardBg:    "linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)",
    border:    "#F1F5F9",
    hoverBorder: "rgba(245,158,11,0.30)",
    /* icon circle */
    iconBg:    "rgba(245,158,11,0.10)",
    iconColor: "#F59E0B",
    /* value */
    valueColor: "#D97706",
    /* bottom line */
    lineColor: "rgba(245,158,11,0.60)",
    /* trend */
    trendColor: "#92400E",
  },
  blue: {
    cardBg:    "linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)",
    border:    "#F1F5F9",
    hoverBorder: "rgba(59,130,246,0.30)",
    iconBg:    "rgba(59,130,246,0.10)",
    iconColor: "#3B82F6",
    valueColor: "#2563EB",
    lineColor: "rgba(59,130,246,0.60)",
    trendColor: "#1E40AF",
  },
  green: {
    cardBg:    "linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)",
    border:    "#F1F5F9",
    hoverBorder: "rgba(34,197,94,0.30)",
    iconBg:    "rgba(34,197,94,0.10)",
    iconColor: "#22C55E",
    valueColor: "#16A34A",
    lineColor: "rgba(34,197,94,0.60)",
    trendColor: "#166534",
  },
  navy: {
    cardBg:    "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
    border:    "#F1F5F9",
    hoverBorder: "rgba(30,58,95,0.30)",
    iconBg:    "rgba(30,58,95,0.10)",
    iconColor: "#1E3A5F",
    valueColor: "#1E3A5F",
    lineColor: "rgba(30,58,95,0.60)",
    trendColor: "#1E3A5F",
  },
};

export default function StatCard({ label, value, icon: Icon, color, trend, onClick }) {
  const s = STYLES[color] ?? STYLES.navy;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-card text-left transition-all duration-[180ms] ease-out ${
        onClick ? "cursor-pointer active:scale-[1.005]" : ""
      }`}
      style={{
        background: s.cardBg,
        border: `1px solid ${s.border}`,
        boxShadow: "var(--shadow-1)",
        padding: "20px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-2)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = s.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-1)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = s.border;
      }}
    >
      {/* Top row: label + icon circle */}
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: "#94A3B8" }}
        >
          {label}
        </p>

        {Icon && (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
            style={{ backgroundColor: s.iconBg }}
          >
            <Icon size={18} aria-hidden style={{ color: s.iconColor }} />
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className="mt-3 text-[36px] font-bold leading-none tracking-tight"
        style={{ color: s.valueColor }}
      >
        {value}
      </p>

      {/* Trend row */}
      {trend && (
        <div
          className="mt-3 flex items-center gap-1.5 text-[12px] font-medium"
          style={{ color: s.trendColor }}
        >
          <ArrowRight size={12} aria-hidden />
          <span>{trend.text}</span>
        </div>
      )}

      {/* Bottom coloured line — 3px, full width, status colour at 60% opacity */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{ backgroundColor: s.lineColor }}
        aria-hidden
      />
    </Component>
  );
}
