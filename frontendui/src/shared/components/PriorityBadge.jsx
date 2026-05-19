const CONFIG = {
  HIGH: {
    cls: "bg-red-50 text-red-600 border-red-200 border-l-2 border-l-red-500",
  },
  MEDIUM: {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  LOW: {
    cls: "bg-green-50 text-green-700 border-green-200",
  },
};

export default function PriorityBadge({ priority }) {
  const { cls } = CONFIG[priority] ?? {
    cls: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ${cls}`}
    >
      {priority}
    </span>
  );
}
