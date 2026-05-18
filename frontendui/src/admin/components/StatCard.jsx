import React from "react";

const colorMap = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  navy: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-xl border p-4 text-left ${colorMap[color] || colorMap.navy}`}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {Icon ? <Icon size={18} /> : null}
      </div>
      <div>{value}</div>
      {trend ? <div>{trend.text}</div> : null}
    </Component>
  );
}
