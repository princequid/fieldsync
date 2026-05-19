const CONFIG = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    pulse: true,
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  VERIFIED: {
    label: "Verified",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export default function StatusBadge({ status, showDot = false }) {
  const { label, cls, dot, pulse } = CONFIG[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex min-w-[90px] items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ${cls}`}
    >
      {showDot ? (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? "animate-pulse-dot" : ""}`}
          aria-hidden
        />
      ) : null}
      {label}
    </span>
  );
}
