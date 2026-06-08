import { Link, useNavigate } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import StatusBadge from "../../shared/components/StatusBadge";
import PriorityBadge from "../../shared/components/PriorityBadge";

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const AVATAR_FILL = "#2E86AB";

const COLUMNS = [
  "Job",
  "Client",
  "Technician",
  "Status",
  "Priority",
  "Updated",
  "Actions",
];

export default function Table({
  jobs,
  onVerify,
  onVerifyClick,
  limit,
  showFooter = false,
  statusFilter = null,
}) {
  const navigate = useNavigate();

  let rows = [...jobs];
  if (statusFilter) rows = rows.filter((job) => job.status === statusFilter);
  if (typeof limit === "number") rows = rows.slice(0, limit);

  if (rows.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-[13px] text-[#94A3B8] dark:text-gray-500">
        No jobs to display.
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-180">
          {/* ── Header ─────────────────────────────────────────────── */}
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] dark:border-gray-800 dark:bg-gray-800">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="group/col cursor-default select-none px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-gray-400"
                >
                  <span className="flex items-center gap-1">
                    {col}
                    {/* Sort hint — visible on header hover */}
                    <ChevronUp
                      size={11}
                      className="opacity-0 transition-opacity group-hover/col:opacity-40"
                      aria-hidden
                    />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────────────── */}
          <tbody>
            {rows.map((job) => {
              const client = job.client ?? null;
              const technician = job.technician ?? null;

              return (
                /* fs-table-row uses CSS transitions defined in index.css — not class toggling */
                <tr
                  key={job.id}
                  onClick={() => navigate(`/admin/jobs/${job.id}`)}
                  className="fs-table-row group h-13 cursor-pointer border-b border-[#F8FAFC] dark:border-gray-800"
                >
                  {/* Job column: title + number/location */}
                  <td className="px-4 py-0 align-middle">
                    <p className="font-mono text-[10px] text-[#94A3B8] dark:text-gray-500">
                      {job.jobNumber}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-[#0F172A] dark:text-gray-100">
                      {job.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#94A3B8] dark:text-gray-500">
                      {job.location}
                    </p>
                  </td>

                  {/* Client */}
                  <td className="px-4 py-0 align-middle text-[13px] text-[#374151] dark:text-gray-300">
                    {client?.companyName ?? "—"}
                  </td>

                  {/* Technician chip */}
                  <td
                    className="px-4 py-0 align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {technician ? (
                      <div className="inline-flex items-center gap-2">
                        <div
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: AVATAR_FILL }}
                        >
                          {technician.initials}
                        </div>
                        <span className="text-[13px] text-[#374151] dark:text-gray-200">
                          {technician.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#94A3B8] dark:text-gray-500">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Status badge — IN_PROGRESS dot uses animate-pulse-dot from CSS */}
                  <td className="px-4 py-0 align-middle">
                    <StatusBadge status={job.status} showDot />
                  </td>

                  {/* Priority badge */}
                  <td className="px-4 py-0 align-middle">
                    <PriorityBadge priority={job.priority} />
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-0 align-middle font-mono text-[11px] text-[#94A3B8] dark:text-gray-500">
                    {formatRelative(job.updatedAt)}
                  </td>

                  {/* Actions — fade in on row hover (opacity via group) */}
                  <td
                    className="px-4 py-0 align-middle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {/* Verify button — only for COMPLETED */}
                      {job.status === "COMPLETED" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onVerifyClick) onVerifyClick(job);
                            else onVerify?.(job.id);
                          }}
                          className="fs-btn-shine relative flex h-7 items-center rounded-badge px-3 text-[11px] font-semibold text-white"
                          style={{
                            background:
                              "#16A34A",
                          }}
                        >
                          Verify
                        </button>
                      )}

                      {/* View button — always shown on hover */}
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        className="flex h-7 items-center rounded-badge bg-[#F1F5F9] px-3 text-[11px] font-medium text-[#374151] dark:bg-gray-800 dark:text-gray-200"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showFooter && (
        <div className="border-t border-[#F1F5F9] bg-white px-4 py-3 text-right dark:border-gray-800 dark:bg-gray-900">
          <Link
            to="/admin/jobs"
            className="text-[13px] font-medium text-brand-accent hover:underline"
          >
            View all jobs →
          </Link>
        </div>
      )}
    </div>
  );
}
