import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChevronRight, MapPin, Building } from "lucide-react";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatRelativeDate } from "../../shared/utils/formatDate";

const STATUS_COLOR = {
  PENDING: "#F59E0B",
  IN_PROGRESS: "#3B82F6",
  COMPLETED: "#22C55E",
  VERIFIED: "#64748B",
};

const STATUS_LABEL = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  VERIFIED: {
    label: "Verified",
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const client = job.client ?? null;
  const stripColor = STATUS_COLOR[job.status] ?? STATUS_COLOR.PENDING;

  useEffect(() => {
    if (document.getElementById("tech-shimmer-style")) return;
    const style = document.createElement("style");
    style.id = "tech-shimmer-style";
    style.innerHTML = `@keyframes techShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`;
    document.head.appendChild(style);
  }, []);
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
      className="mx-3 my-1 overflow-hidden rounded-card border border-[#F1F5F9] bg-white text-left dark:border-gray-800 dark:bg-gray-900"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      {/* Status strip */}
      <div
        className="w-1 shrink-0 h-full rounded-l-xl relative overflow-hidden"
        aria-hidden
        style={{ backgroundColor: stripColor }}
      >
        {job.status === "IN_PROGRESS" && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "transparent",
              backgroundSize: "200% 100%",
              animation: "techShimmer 2s linear infinite",
            }}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center pt-3.5 pr-3.5 pb-3.5 pl-4.5">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2">
          <p
            className="text-[14px] font-semibold leading-snug text-[#0F172A] dark:text-gray-50"
            style={{
              letterSpacing: "-0.2px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
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
        <div className="mt-1 flex items-center" style={{ gap: 4 }}>
          <Building size={11} className="shrink-0 text-[#94A3B8]" aria-hidden />
          <p className="truncate text-[12px] font-medium text-[#64748B] dark:text-gray-400">
            {client?.name ?? "Unknown client"}
          </p>
        </div>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#64748B] dark:text-gray-400">
          <MapPin
            size={12}
            className="shrink-0 text-[#94A3B8] dark:text-gray-500"
            aria-hidden
          />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Footer */}
        <div className="mt-2.5 border-t border-[#F8FAFC] dark:border-gray-800 pt-2.5 flex items-center justify-between">
          <PriorityBadge priority={job.priority} />
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] dark:text-gray-500">
            <span>{formatRelativeDate(job.updatedAt)}</span>
            <ChevronRight size={13} aria-hidden />
          </div>
        </div>
      </div>
    </button>
  );
}
