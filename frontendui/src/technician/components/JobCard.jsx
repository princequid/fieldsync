import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatRelativeDate } from "../../shared/utils/formatDate";

const STATUS_STRIP = {
  PENDING: "from-amber-400 to-amber-500",
  IN_PROGRESS: "from-blue-500 to-blue-600",
  COMPLETED: "from-green-500 to-green-600",
  VERIFIED: "from-brand-navy to-brand-accent",
};

const STATUS_LABEL = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Completed", cls: "bg-green-50 text-green-700" },
  VERIFIED: { label: "Verified", cls: "bg-slate-100 text-slate-600" },
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const client = getUserById(job.clientId);
  const strip = STATUS_STRIP[job.status] ?? STATUS_STRIP.PENDING;
  const status = STATUS_LABEL[job.status];

  function handleOpen() {
    window.setTimeout(() => {
      navigate(`/tech/jobs/${job.id}`);
    }, 80);
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="fs-btn-press mx-3 my-1 flex min-h-20 w-[calc(100%-1.5rem)] overflow-hidden rounded-r-[16px] rounded-l-none border border-black/5 bg-white text-left"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      {/* Status strip */}
      <div className={`w-1 shrink-0 bg-linear-to-b ${strip}`} aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[14px] font-semibold leading-snug text-gray-900">
            {job.title}
          </p>
          {status && (
            <span
              className={`shrink-0 rounded-badge px-2 py-0.5 text-[10px] font-medium ${status.cls}`}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Client */}
        <p className="mt-1 truncate text-[12px] text-[#64748B]">
          {client?.name ?? "Unknown client"}
        </p>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#64748B]">
          <MapPin size={13} className="shrink-0 text-[#94A3B8]" aria-hidden />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <PriorityBadge priority={job.priority} />
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
            <span>{formatRelativeDate(job.updatedAt)}</span>
            <ChevronRight size={13} aria-hidden />
          </div>
        </div>
      </div>
    </button>
  );
}
