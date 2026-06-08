import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Building } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import StatusBanner from "../components/StatusBanner";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatFullDate, formatTime } from "../../shared/utils/formatDate";

const STATUS_DOT = {
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-amber-400",
  COMPLETED: "bg-green-500",
  VERIFIED: "bg-slate-400",
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
      <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
        <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
          Job not found
        </p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="fs-btn-gradient-accent fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  if (job.technicianId !== user?.id) return null;

  const client = job.client ?? null;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;
  const showTimeline = job.status === "COMPLETED" || job.status === "VERIFIED";
  const history = [...(job.statusHistory ?? [])].reverse();

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 pb-36">
        {/* Back link */}
        <Link
          to="/tech/jobs"
          className="fs-focus-ring flex h-11 items-center gap-2 px-4 text-[13px] font-medium text-brand-accent"
        >
          <ArrowLeft size={16} aria-hidden />
          My Jobs
        </Link>

        <StatusBanner job={job} />

        <div className="space-y-3 p-4">
          {/* Job card */}
          <section className="fs-card p-4">
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
              {job.title}
            </h2>
            <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
              {client?.name ?? "Unknown client"}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
              {job.description}
            </p>
          </section>

          {/* Location */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="fs-card flex h-11 items-center gap-3 px-4"
          >
            <MapPin size={16} className="shrink-0 text-[#2E86AB]" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-brand-accent">
              {job.location}
            </span>
          </a>

          {/* Contact */}
          {client && (
            <section className="fs-card p-4">
              <p className="fs-label text-gray-400 dark:text-gray-500">
                Contact
              </p>
              <p className="mt-2 text-[13px] font-medium text-gray-900 dark:text-gray-100">
                {client.contactName ?? client.name}
              </p>
              {client.phone && (
                <a
                  href={`tel:${client.phone.replace(/\s/g, "")}`}
                  className="mt-2 flex h-11 items-center gap-2 text-[13px] font-medium text-[#2E86AB]"
                >
                  <Phone size={16} aria-hidden />
                  {client.phone}
                </a>
              )}
            </section>
          )}

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile label="Assigned" value={formatFullDate(job.createdAt)} />
            <StatTile
              label="Priority"
              value={<PriorityBadge priority={job.priority} />}
            />
          </div>

          {/* Status history */}
          {showTimeline && history.length > 0 && (
            <section className="fs-card p-4">
              <p className="fs-label text-gray-400 dark:text-gray-500">
                Status History
              </p>
              <ul className="mt-4 space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                    <div className="flex gap-3">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-400"}`}
                      />
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                          {entry.status.replaceAll("_", " ")} by{" "}
                          {entry.changedByName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                          {formatFullDate(entry.changedAt)} ·{" "}
                          {formatTime(entry.changedAt)}
                        </p>
                        {entry.note && (
                          <p className="mt-1 text-[13px] text-gray-600 dark:text-gray-400">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <JobActionBar job={job} jobId={id} navigate={navigate} />
    </div>
  );
}

function JobActionBar({ job, jobId, navigate }) {
  const shellStyle = {
    bottom: "64px",
    boxShadow: "var(--shadow-1)",
  };

  if (job.status === "PENDING") {
    return (
      <div
        className="sticky z-10 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
        style={shellStyle}
      >
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="fs-btn-shine fs-btn-gradient-accent fs-focus-ring w-full rounded-card text-[16px] font-semibold text-white"
          style={{ height: "52px" }}
        >
          Start This Job
        </button>
      </div>
    );
  }

  if (job.status === "IN_PROGRESS") {
    return (
      <div
        className="sticky z-10 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
        style={shellStyle}
      >
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="fs-btn-shine fs-btn-gradient-success fs-focus-ring w-full rounded-card text-[16px] font-semibold text-white"
          style={{ height: "52px" }}
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  if (job.status === "COMPLETED") {
    return (
      <div
        className="sticky z-10 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
        style={shellStyle}
      >
        <div className="flex h-13 w-full items-center justify-center rounded-card bg-gray-100 text-[16px] font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          Awaiting admin verification
        </div>
      </div>
    );
  }

  return (
    <div
      className="sticky z-10 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
      style={shellStyle}
    >
      <div className="flex h-13 w-full items-center justify-center rounded-card bg-brand-navy text-[16px] font-semibold text-white/80">
        This job is closed
      </div>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div
      className="rounded-card border bg-white dark:bg-gray-900 p-3"
      style={{ border: "1px solid #F1F5F9" }}
    >
      <p className="fs-label text-gray-400 dark:text-gray-500">{label}</p>
      <div className="mt-1 text-[13px] font-mono text-[#374151] dark:text-gray-300">
        {value}
      </div>
    </div>
  );
}
