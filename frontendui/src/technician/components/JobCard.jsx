import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatRelativeDate } from "../../shared/utils/formatDate";

const STRIP_COLORS = {
  PENDING: "bg-amber-400",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
  VERIFIED: "bg-[#1E3A5F]",
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const client = getUserById(job.clientId);
  const strip = STRIP_COLORS[job.status] ?? STRIP_COLORS.PENDING;

  return (
    <button
      type="button"
      onClick={() => navigate(`/tech/jobs/${job.id}`)}
      className="flex w-full min-h-[72px] overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={`w-[3px] shrink-0 ${strip}`} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
        <p className="font-semibold leading-snug text-gray-900">{job.title}</p>
        <p className="mt-1 truncate text-xs text-gray-500">
          {client?.name ?? "Unknown client"}
        </p>
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
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
