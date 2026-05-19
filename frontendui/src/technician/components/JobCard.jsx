import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatRelativeDate } from "../../shared/utils/formatDate";

const STRIP_GRADIENTS = {
  PENDING: "from-amber-400 to-amber-600",
  IN_PROGRESS: "from-blue-500 to-blue-700",
  COMPLETED: "from-green-500 to-green-700",
  VERIFIED: "from-[#1E3A5F] to-[#2E86AB]",
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const client = getUserById(job.clientId);
  const strip = STRIP_GRADIENTS[job.status] ?? STRIP_GRADIENTS.PENDING;

  return (
    <button
      type="button"
      onClick={() => navigate(`/tech/jobs/${job.id}`)}
      className="fs-btn-press mx-3 flex w-[calc(100%-24px)] min-h-[72px] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] text-left transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
    >
      <div className={`w-1 shrink-0 bg-gradient-to-b ${strip}`} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
        <p className="text-[14px] font-semibold leading-snug text-gray-900">
          {job.title}
        </p>
        <p className="mt-1 truncate text-[13px] text-gray-500">
          {client?.name ?? "Unknown client"}
        </p>
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[13px] text-gray-500">
          <MapPin size={14} className="shrink-0 text-gray-400" aria-hidden />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <PriorityBadge priority={job.priority} />
          <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-gray-600">
            <span className="text-gray-400">
              {formatRelativeDate(job.updatedAt)}
            </span>
            <span>View</span>
            <ChevronRight size={14} aria-hidden />
          </div>
        </div>
      </div>
    </button>
  );
}
