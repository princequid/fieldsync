import React from "react";

export default function TechChip({ technician }) {
  if (!technician) {
    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-gray-500">
        Unassigned
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#2E86AB] text-sm font-semibold text-white">
        {technician.initials}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-gray-900">
          {technician.name}
        </div>
        <div className="text-xs text-gray-400">
          {technician.online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
