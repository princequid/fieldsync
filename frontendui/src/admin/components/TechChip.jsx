export default function TechChip({ technician }) {
  if (!technician) {
    return (
      <span className="inline-flex rounded-full border border-[#E5E7EB] bg-slate-50 px-3 py-1.5 text-[13px] text-gray-500">
        Unassigned
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2E86AB] text-xs font-semibold text-white">
        {technician.initials}
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-medium text-gray-900">
          {technician.name}
        </div>
        <div className="text-[11px] text-gray-400">
          {technician.online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
