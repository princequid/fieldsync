import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, ChevronRight } from "lucide-react";
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
  COMPLETED: "bg-[#27AE60]",
  VERIFIED: "bg-slate-400",
};

const STATUS_LABEL = {
  IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700", label: "In Progress" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  COMPLETED: { bg: "bg-green-50", text: "text-[#27AE60]", label: "Completed" },
  VERIFIED: { bg: "bg-slate-100", text: "text-slate-600", label: "Verified" },
};

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
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">??</span>
        </div>
        <p className="text-base font-semibold text-gray-900">Job not found</p>
        <p className="text-sm text-gray-400 mt-1">This job may have been removed or reassigned.</p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="mt-6 h-11 rounded-2xl bg-[#2E86AB] px-6 text-sm font-semibold text-white"
      <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
        <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Job not found</p>
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
  const statusStyle = STATUS_LABEL[job.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: job.status };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 pb-28">

        {/* nav */}
        <Link
          to="/tech/jobs"
          className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[#2E86AB]"

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

          {/* main job card */}
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

          {/* location */}
          {/* Job card */}
          <section className="fs-card p-4">
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{job.title}</h2>
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

          {/* contact */}
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

          {/* meta tiles */}
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Assigned" value={formatFullDate(job.createdAt)} />
            <StatTile label="Priority" value={<PriorityBadge priority={job.priority} />} />
          </div>

          {/* timeline */}
          {showTimeline && history.length > 0 ? (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-4">Status History</p>
              <ul className="space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${entry.changedAt}-${index}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-300"}`} />
                      {index < history.length - 1 && (
                        <div className="w-px flex-1 bg-slate-100 mt-1.5" />
                      )}
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
              <p className="fs-label text-gray-400 dark:text-gray-500">Contact</p>
              <p className="mt-2 text-[13px] font-medium text-gray-900 dark:text-gray-100">
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
              <p className="fs-label text-gray-400 dark:text-gray-500">Status History</p>
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
          ) : null}
          )}
        </div>
      </div>

      <JobActionBar job={job} jobId={id} navigate={navigate} />
    </div>
  );
}

function JobActionBar({ job, jobId, navigate }) {
  if (job.status === "PENDING") {
    return (
      <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/start`)}
          className="w-full h-14 rounded-2xl bg-[#2E86AB] text-base font-semibold text-white active:scale-[0.98] transition-transform"
  const shellStyle = {
    bottom: "64px",
    boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
  };

  if (job.status === "PENDING") {
    return (
      <div
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm dark:bg-gray-900/96"
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
      <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${jobId}/complete`)}
          className="w-full h-14 rounded-2xl bg-[#27AE60] text-base font-semibold text-white active:scale-[0.98] transition-transform"
      <div
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm dark:bg-gray-900/96"
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
      <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white px-4 py-4">
        <div className="w-full h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <span className="text-sm font-medium text-slate-400">Awaiting admin verification</span>
      <div
        className="sticky z-10 bg-white/96 px-4 py-3 backdrop-blur-sm dark:bg-gray-900/96"
        style={shellStyle}
      >
        <div className="flex h-13 w-full items-center justify-center rounded-[12px] bg-gray-100 text-[16px] font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          Awaiting admin verification
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white px-4 py-4">
      <div className="w-full h-12 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
        <span className="text-sm font-semibold text-white/60">This job is closed</span>
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
    </div>
  );
}
    <div className="fs-card p-3">
      <p className="fs-label text-gray-400 dark:text-gray-500">{label}</p>
      <div className="mt-1 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}
