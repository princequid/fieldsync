import { ArrowRight } from "lucide-react";

const VALUE_COLORS = {
  amber: "#D97706",
  blue: "#2563EB",
  green: "#16A34A",
  navy: "#1E3A5F",
};

export default function StatCard({ label, value, icon: Icon, color, trend, onClick }) {
  const valueColor = VALUE_COLORS[color] ?? VALUE_COLORS.navy;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`fs-card border border-gray-200 p-5 text-left dark:border-gray-800 dark:bg-gray-900 ${
        onClick ? "cursor-pointer hover:border-gray-300 dark:hover:border-gray-700" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {Icon && <Icon size={18} aria-hidden className="text-gray-400 dark:text-gray-500" />}
      </div>

      <p className="mt-2 text-[28px] font-semibold leading-none" style={{ color: valueColor }}>
        {value}
      </p>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
          <ArrowRight size={12} aria-hidden />
          <span>{trend.text}</span>
        </div>
      )}
    </Component>
  );
}
