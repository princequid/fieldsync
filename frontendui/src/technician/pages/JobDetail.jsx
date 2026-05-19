import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import StatusBanner from "../components/StatusBanner";
import PriorityBadge from "../../shared/components/PriorityBadge";
import { formatFullDate, formatTime } from "../../shared/utils/formatDate";

// small colored dots for each status type
const STATUS_DOT = {
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-amber-400",
  COMPLETED: "bg-green-500",
  VERIFIED: "bg-slate-500",
};

export default function TechJobDetail() {
  // getting job id from the route
  const { id } = useParams();

  // for page navigation
  const navigate = useNavigate();

  // current logged in user
  const { user } = useAuth();

  // technician jobs data
  const { jobs } = useTechnicianData(user?.id);

  // finds the specific job matching the route id
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  // prevents technician from accessing jobs not assigned to them
  useEffect(() => {
    if (job && job.technicianId !== user?.id) {
      navigate("/403", { replace: true });
    }
  }, [job, user?.id, navigate]);

  // fallback if job doesn't exist
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

  // extra protection for unauthorized access
  if (job.technicianId !== user?.id) {
    return null;
  }

  // gets client details
  const client = getUserById(job.clientId);

  // google maps link for location
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;

  // only show history for completed/verified jobs
  const showTimeline =
    job.status === "COMPLETED" || job.status === "VERIFIED";

  // newest history entries first
  const history = [...(job.statusHistory ?? [])].reverse();

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 pb-24">
        {/* back navigation */}
        <Link
          to="/tech/jobs"
          className="flex min-h-11 items-center gap-2 px-4 py-2 text-sm font-medium text-[#2E86AB]"
        >
          <ArrowLeft size={18} aria-hidden />
          My Jobs
        </Link>

        {/* top status banner */}
        <StatusBanner job={job} />

        <div className="space-y-4 p-4">
          {/* job details card */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>

            <p className="mt-1 text-sm text-gray-500">
              {client?.name ?? "Unknown client"}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {job.description}
            </p>
          </section>

          {/* location card */}
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

          {/* client contact section */}
          {client ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Contact
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {client.contactName ?? client.name}
              </p>

              {/* call client button */}
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

          {/* assigned date and priority */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Assigned" value={formatFullDate(job.createdAt)} />

            <StatTile
              label="Priority"
              value={<PriorityBadge priority={job.priority} />}
            />
          </div>

          {/* status timeline/history */}
          {showTimeline && history.length > 0 ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Status History
              </p>

              <ul className="mt-4 space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                    <div className="flex gap-3">
                      {/* colored status dot */}
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-400"}`}
                      />

                      <div>
                        {/* who changed the status */}
                        <p className="text-sm font-medium text-gray-900">
                          {entry.status.replaceAll("_", " ")} by{" "}
                          {entry.changedByName}
                        </p>

                        {/* date and time */}
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatFullDate(entry.changedAt)} ·{" "}
                          {formatTime(entry.changedAt)}
                        </p>

                        {/* optional status note */}
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

      {/* sticky bottom action buttons */}
      <JobActionBar job={job} jobId={id} navigate={navigate} />
    </div>
  );
}

function JobActionBar({ job, jobId, navigate }) {
  // pending jobs can be started
  if (job.status === "PENDING") {
    return (
      <div className="sticky bottom-0 z-10 border-t border-[#E5E7EB] bg-white/95 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="fs-btn-shine fs-btn-gradient-accent fs-btn-press fs-focus-ring w-full rounded-2xl text-base font-semibold text-white"
          style={{ minHeight: "56px" }}
        >
          Start This Job
        </button>
      </div>
    );
  }

  // in progress jobs can be completed
  if (job.status === "IN_PROGRESS") {
    return (
      <div className="sticky bottom-0 z-10 border-t border-[#E5E7EB] bg-white/95 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="fs-btn-shine fs-btn-gradient-success fs-btn-press fs-focus-ring w-full rounded-2xl text-base font-semibold text-white"
          style={{ minHeight: "56px" }}
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  // completed jobs wait for admin verification
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

  // final fallback state
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
      {/* small title */}
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      {/* main value */}
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}