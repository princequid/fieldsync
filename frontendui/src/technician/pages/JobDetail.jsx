import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
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
        <p className="text-[15px] font-semibold text-gray-900">Job not found</p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="fs-btn-gradient-accent fs-btn-press fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-semibold text-white"
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
            <h2 className="text-[18px] font-bold text-gray-900">{job.title}</h2>
            <p className="mt-1 text-[12px] text-gray-400">
              {client?.name ?? "Unknown client"}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
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
            <MapPin size={16} className="shrink-0 text-[#27AE60]" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-brand-accent">
              {job.location}
            </span>
          </a>

          {/* Contact */}
          {client && (
            <section className="fs-card p-4">
              <p className="fs-label text-gray-400">Contact</p>
              <p className="mt-2 text-[13px] font-medium text-gray-900">
                {client.contactName ?? client.name}
              </p>
              {client.phone && (
                <a
                  href={`tel:${client.phone.replace(/\s/g, "")}`}
                  className="mt-2 flex h-11 items-center gap-2 text-[13px] font-medium text-[#27AE60]"
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
              <p className="fs-label text-gray-400">Status History</p>
              <ul className="mt-4 space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                    <div className="flex gap-3">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-400"}`}
                      />
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">
                          {entry.status.replaceAll("_", " ")} by{" "}
                          {entry.changedByName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {formatFullDate(entry.changedAt)} ·{" "}
                          {formatTime(entry.changedAt)}
                        </p>
                        {entry.note && (
                          <p className="mt-1 text-[13px] text-gray-600">
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
    boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
  };

  if (job.status === "PENDING") {
    return (
      <div
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm"
        style={shellStyle}
      >
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="fs-btn-shine fs-btn-gradient-accent fs-btn-press fs-focus-ring w-full rounded-[12px] text-[16px] font-semibold text-white"
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
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm"
        style={shellStyle}
      >
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="fs-btn-shine fs-btn-gradient-success fs-btn-press fs-focus-ring w-full rounded-[12px] text-[16px] font-semibold text-white"
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
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm"
        style={shellStyle}
      >
        <div className="flex h-13 w-full items-center justify-center rounded-[12px] bg-gray-100 text-[16px] font-semibold text-gray-400">
          Awaiting admin verification
        </div>
      </div>
    );
  }

  return (
    <div
      className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm"
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
    <div className="fs-card p-3">
      <p className="fs-label text-gray-400">{label}</p>
      <div className="mt-1 text-[13px] font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}
