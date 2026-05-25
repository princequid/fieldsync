import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import StatusBanner from "../components/StatusBanner";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatFullDate, formatTime } from "../../shared/utils/formatDate";

const STATUS_DOT = {
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-amber-400",
  COMPLETED: "bg-[#27AE60]",
  VERIFIED: "bg-slate-400",
};

const STATUS_LABEL = {
  IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700", label: "In Progress" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  COMPLETED: { bg: "bg-green-50", text: "text-[#27AE60]", label: "Completed" },
  VERIFIED: { bg: "bg-slate-100", text: "text-slate-600", label: "Verified" },
};

export default function TechJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs } = useTechnicianData(user?.id);
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  useEffect(() => {
    if (job && job.technicianId !== user?.id) {
      navigate("/403", { replace: true });
    }
  }, [job, user?.id, navigate]);

  if (!job) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-base font-semibold text-gray-900">Job not found</p>
        <p className="text-sm text-gray-400 mt-1">This job may have been removed or reassigned.</p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="mt-6 h-11 rounded-2xl bg-[#2E86AB] px-6 text-sm font-semibold text-white"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  if (job.technicianId !== user?.id) return null;

  const client = getUserById(job.clientId);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;
  const showTimeline = job.status === "COMPLETED" || job.status === "VERIFIED";
  const history = [...(job.statusHistory ?? [])].reverse();
  const statusStyle = STATUS_LABEL[job.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: job.status };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 pb-28">
        <div className="px-4 pt-4">
          <Link
            to="/tech/jobs"
            className="flex items-center gap-1.5 text-sm font-medium text-[#2E86AB]"
          >
            <ArrowLeft size={16} aria-hidden />
            My Jobs
          </Link>
        </div>

        <StatusBanner job={job} />

        <div className="space-y-3 p-4">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h2>
                <p className="mt-0.5 text-sm text-gray-400">{job.id}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.label}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{job.description}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-gray-500">
              {client?.name ?? "Unknown client"}
            </div>
          </section>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-[#27AE60]" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-[#2E86AB] mt-0.5 truncate">{job.location}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 shrink-0" aria-hidden />
          </a>

          {client ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">Contact</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2E86AB]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#2E86AB]">
                    {(client.contactName ?? client.name ?? "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{client.contactName ?? client.name}</p>
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 mt-0.5 text-sm text-[#27AE60] font-medium"
                    >
                      <Phone size={13} aria-hidden />
                      {client.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Assigned" value={formatFullDate(job.createdAt)} />
            <StatTile label="Priority" value={<PriorityBadge priority={job.priority} />} />
          </div>

          {showTimeline && history.length > 0 ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-4">Status History</p>
              <ul className="space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-300"}`} />
                      {index < history.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1.5" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.status.replaceAll("_", " ")} by {entry.changedByName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatFullDate(entry.changedAt)} · {formatTime(entry.changedAt)}
                      </p>
                      {entry.note ? (
                        <p className="mt-1 text-sm text-gray-500 bg-slate-50 rounded-xl px-3 py-2">{entry.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <JobActionBar job={job} jobId={id} navigate={navigate} />
    </div>
  );
}

function JobActionBar({ job, jobId, navigate }) {
  if (job.status === "PENDING") {
    return (
      <div className="sticky bottom-0 z-10 bg-white/95 border-t border-slate-100 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="w-full h-14 rounded-2xl bg-[#2E86AB] text-base font-semibold text-white active:scale-[0.98] transition-transform"
        >
          Start This Job
        </button>
      </div>
    );
  }

  if (job.status === "IN_PROGRESS") {
    return (
      <div className="sticky bottom-0 z-10 bg-white/95 border-t border-slate-100 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="w-full h-14 rounded-2xl bg-[#27AE60] text-base font-semibold text-white active:scale-[0.98] transition-transform"
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  if (job.status === "COMPLETED") {
    return (
      <div className="sticky bottom-0 z-10 bg-white/95 border-t border-slate-100 px-4 py-4 backdrop-blur-sm">
        <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium text-slate-500">
          Awaiting admin verification
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-10 bg-white/95 border-t border-slate-100 px-4 py-4 backdrop-blur-sm">
      <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium text-slate-500">
    <div
      className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm dark:bg-gray-900/96"
      style={shellStyle}
    >
      <div className="flex h-13 w-full items-center justify-center rounded-[12px] bg-brand-navy text-[16px] font-semibold text-white/80">
        This job is closed
      </div>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1.5 text-sm font-semibold text-gray-900">{value}</div>
    <div
      className="rounded-[12px] border bg-white dark:bg-gray-900 p-3"
      style={{ border: "1px solid #F1F5F9" }}
    >
      <p className="fs-label text-gray-400 dark:text-gray-500">{label}</p>
      <div className="mt-1 text-[13px] font-mono text-[#374151] dark:text-gray-300">
        {value}
      </div>
    </div>
  );
}
