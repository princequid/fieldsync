const CONFIG = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  VERIFIED: {
    label: "Verified",
    cls: "bg-slate-100 text-slate-700 border border-slate-200",
    dot: "bg-slate-500",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
};

export default function StatusBadge({ status, showDot = false }) {
  const { label, cls, dot } = CONFIG[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {showDot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      ) : null}
      {label}
    </span>
  );
}
