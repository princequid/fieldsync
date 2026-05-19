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
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Job
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Client
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Technician
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Priority
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Updated
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
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
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-mono text-xs text-gray-400">
                      {job.jobNumber}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {job.title}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {client?.name ?? "—"}
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <TechChip technician={technician} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-4">
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatRelative(job.updatedAt)}
                  </td>
                  <td
                    className="px-4 py-4"
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
                        className="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
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
