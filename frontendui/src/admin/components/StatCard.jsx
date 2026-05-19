const STYLES = {
  amber: {
    card: "from-[#FFFBF2] to-[#FAFAFA]",
    strip: "from-[#F59E0B] to-[#D97706]",
    value: "text-amber-700",
    icon: "bg-amber-100 text-amber-700",
    chip: "bg-amber-50 text-amber-700",
  },
  blue: {
    card: "from-[#F0F7FF] to-[#FAFAFA]",
    strip: "from-[#3B82F6] to-[#2563EB]",
    value: "text-blue-700",
    icon: "bg-blue-100 text-blue-700",
    chip: "bg-blue-50 text-blue-700",
  },
  green: {
    card: "from-[#F0FDF4] to-[#FAFAFA]",
    strip: "from-[#22C55E] to-[#16A34A]",
    value: "text-green-700",
    icon: "bg-green-100 text-green-700",
    chip: "bg-green-50 text-green-700",
  },
  navy: {
    card: "from-[#F8FAFC] to-[#FAFAFA]",
    strip: "from-[#1E3A5F] to-[#2E86AB]",
    value: "text-[#1E3A5F]",
    icon: "bg-slate-100 text-slate-700",
    chip: "bg-slate-100 text-slate-700",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
}) {
  const style = STYLES[color] ?? STYLES.navy;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gradient-to-b p-5 text-left transition-all duration-200",
        style.card,
        onClick
          ? "fs-btn-press cursor-pointer hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
          : "",
      ].join(" ")}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.strip}`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="fs-label text-gray-500">{label}</p>
          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${style.value}`}
          >
            {value}
          </p>
        </div>
        {Icon ? (
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.06)] ${style.icon}`}
          >
            <Icon size={18} aria-hidden />
          </span>
        ) : null}
      </div>
      {trend ? (
        <span
          className={`mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${style.chip}`}
        >
          {trend.text}
        </span>
      ) : null}
    </Component>
  );
}
