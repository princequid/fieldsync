import { Link, useNavigate } from "react-router-dom";
import { getUserById } from "../../shared/utils/mockData";
import StatusBadge from "../../shared/components/StatusBadge";
import PriorityBadge from "../../shared/components/PriorityBadge";
import TechChip from "./TechChip";

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

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
  if (statusFilter) {
    rows = rows.filter((job) => job.status === statusFilter);
  }
  if (typeof limit === "number") {
    rows = rows.slice(0, limit);
  }

  if (rows.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-gray-500">
        No jobs to display.
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-left">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Job
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Client
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Technician
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Priority
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Updated
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((job) => {
              const client = getUserById(job.clientId);
              const technician = getUserById(job.technicianId);

              return (
                <tr
                  key={job.id}
                  onClick={() => navigate(`/admin/jobs/${job.id}`)}
                  className="group cursor-pointer border-l-2 border-l-transparent transition-colors hover:border-l-[#2E86AB] hover:bg-[#F8FAFC]"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-[11px] text-[#9CA3AF]">
                      {job.jobNumber}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-[#111827]">
                      {job.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700">
                    {client?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <TechChip technician={technician} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} showDot />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">
                    {formatRelative(job.updatedAt)}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {job.status === "COMPLETED" ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onVerifyClick) {
                            onVerifyClick(job);
                          } else {
                            onVerify?.(job.id);
                          }
                        }}
                        className="fs-btn-gradient-verify fs-btn-press fs-focus-ring h-7 rounded-lg px-3 text-xs font-medium text-white opacity-60 transition-opacity group-hover:opacity-100"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 opacity-60 group-hover:opacity-100">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showFooter ? (
        <div className="border-t border-slate-200 px-4 py-3 text-right">
          <Link
            to="/admin/jobs"
            className="text-sm font-medium text-[#2E86AB] hover:underline"
          >
            View all jobs →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
