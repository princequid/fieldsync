export default function TechChip({ technician }) {
  if (!technician) {
    return (
      <span className="inline-flex rounded-badge border border-black/5 bg-gray-50 px-3 py-1 text-[12px] text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
        Unassigned
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-badge border border-black/5 bg-white px-2 py-1 shadow-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:shadow-black/20">
      <div className="grid h-6 w-6 place-items-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
        {technician.initials}
      </div>
      <div className="leading-tight">
        <div className="text-[12px] font-medium text-gray-900 dark:text-gray-200">
          {technician.name}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500">
          {technician.online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
