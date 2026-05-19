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
  VERIFIED: "bg-slate-500",
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
        <p className="text-lg font-semibold text-gray-900">Job not found</p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="mt-6 min-h-11 rounded-2xl bg-[#2E86AB] px-6 text-sm font-semibold text-white"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  if (job.technicianId !== user?.id) {
    return null;
  }

  const client = getUserById(job.clientId);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;
  const showTimeline =
    job.status === "COMPLETED" || job.status === "VERIFIED";
  const history = [...(job.statusHistory ?? [])].reverse();

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 pb-24">
        <Link
          to="/tech/jobs"
          className="flex min-h-11 items-center gap-2 px-4 py-2 text-sm font-medium text-[#2E86AB]"
        >
          <ArrowLeft size={18} aria-hidden />
          My Jobs
        </Link>

        <StatusBanner job={job} />

        <div className="space-y-4 p-4">
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {client?.name ?? "Unknown client"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {job.description}
            </p>
          </section>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <MapPin size={18} className="shrink-0 text-[#27AE60]" aria-hidden />
            <span className="min-w-0 flex-1 text-sm font-medium text-[#2E86AB]">
              {job.location}
            </span>
          </a>

          {client ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Contact
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {client.contactName ?? client.name}
              </p>
              {client.phone ? (
                <a
                  href={`tel:${client.phone.replace(/\s/g, "")}`}
                  className="mt-2 flex min-h-11 items-center gap-2 text-sm font-medium text-[#27AE60]"
                >
                  <Phone size={18} aria-hidden />
                  {client.phone}
                </a>
              ) : null}
            </section>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Assigned" value={formatFullDate(job.createdAt)} />
            <StatTile
              label="Priority"
              value={<PriorityBadge priority={job.priority} />}
            />
          </div>

          {showTimeline && history.length > 0 ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Status History
              </p>
              <ul className="mt-4 space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                    <div className="flex gap-3">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-400"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.status.replaceAll("_", " ")} by{" "}
                          {entry.changedByName}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatFullDate(entry.changedAt)} ·{" "}
                          {formatTime(entry.changedAt)}
                        </p>
                        {entry.note ? (
                          <p className="mt-1 text-sm text-gray-600">
                            {entry.note}
                          </p>
                        ) : null}
                      </div>
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
      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="w-full rounded-2xl bg-[#2E86AB] text-sm font-semibold text-white"
          style={{ minHeight: "48px" }}
        >
          Start This Job
        </button>
      </div>
    );
  }

  if (job.status === "IN_PROGRESS") {
    return (
      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="w-full rounded-2xl text-sm font-semibold text-white"
          style={{ minHeight: "48px", backgroundColor: "#27AE60" }}
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  if (job.status === "COMPLETED") {
    return (
      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-2xl bg-gray-200 text-sm font-semibold text-gray-400"
          style={{ minHeight: "48px" }}
        >
          Awaiting admin verification
        </button>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-4">
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-2xl text-sm font-semibold text-white"
        style={{ minHeight: "48px", backgroundColor: "#1E3A5F" }}
      >
        This job is closed
      </button>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
