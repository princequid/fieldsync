const CONFIG = {
  PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", cls: "bg-green-100 text-green-700" },
  VERIFIED: { label: "Verified", cls: "bg-slate-100 text-slate-600" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

export default function StatusBadge({ status }) {
  const { label, cls } = CONFIG[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
