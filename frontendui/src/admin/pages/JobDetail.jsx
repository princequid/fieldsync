import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById, getUserById } from "../../shared/utils/mockData";
import TechChip from "../components/TechChip";

const STATUS_META = {
  PENDING: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    accent: "bg-amber-400",
  },
  IN_PROGRESS: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    accent: "bg-blue-500",
  },
  COMPLETED: {
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    accent: "bg-green-500",
  },
  VERIFIED: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    accent: "bg-[#1E3A5F]",
  },
  CANCELLED: {
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    accent: "bg-red-500",
  },
};

const PRIORITY_META = {
  HIGH: "bg-red-50 text-red-600 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-green-50 text-green-700 border-green-200",
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = getJobById(id);

  const detail = useMemo(() => {
    if (!job) {
      return null;
    }

    const client = getUserById(job.clientId);
    const technician = getUserById(job.technicianId);

    return { client, technician };
  }, [job]);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f5f2ee] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-4xl bg-white p-8 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
          <p className="text-xl font-bold text-gray-900">Job not found</p>
          <p className="mt-2 text-sm text-gray-700">
            The job you’re looking for does not exist in the current mock data.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/jobs")}
            className="mt-6 rounded-full bg-[#1E3A5F] px-4 py-2 text-sm font-medium text-white"
          >
            ← All Jobs
          </button>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[job.status] ?? STATUS_META.PENDING;
  const jobHistory = [...(job.statusHistory ?? [])].reverse();
  const createdAt = formatDateTime(job.createdAt);
  const updatedAt = formatDateTime(job.updatedAt);
  const locationHref = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;
  const showVerify = job.status === "COMPLETED";
  const showEditAndCancel =
    job.status !== "VERIFIED" && job.status !== "CANCELLED";
  const summaryFields = [
    { label: "Job #", value: job.jobNumber },
    { label: "Status", value: job.status.replaceAll("_", " ") },
    { label: "Priority", value: job.priority },
    { label: "Technician", value: detail?.technician?.name ?? "Unassigned" },
    { label: "Client", value: detail?.client?.name ?? "Unknown client" },
    { label: "Created", value: createdAt },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ee] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-4xl bg-white px-5 py-5 shadow-[0_20px_60px_rgba(30,58,95,0.08)] md:flex-row md:items-start md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="text-sm font-medium text-[#2E86AB] hover:underline"
            >
              ← All Jobs
            </button>
            <p className="mt-3 font-mono text-xs text-gray-400">
              {job.jobNumber}
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900 md:text-3xl">
              {job.title}
            </h1>
          </div>

          <span
            className={`inline-flex h-fit rounded-full border px-3 py-1 text-sm font-medium ${meta.badge}`}
          >
            {job.status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <section className="rounded-4xl bg-white p-6 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
              <div className={`mb-5 h-1.5 w-24 rounded-full ${meta.accent}`} />
              <h2 className="text-sm font-semibold text-gray-900">
                Job Information
              </h2>

              <div className="mt-5 space-y-5 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Description
                  </p>
                  <p className="mt-2 leading-7">{job.description}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Location
                  </p>
                  <a
                    href={locationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[#2E86AB] hover:underline"
                  >
                    {job.location}
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock
                    label="Client"
                    value={detail?.client?.name ?? "Unknown client"}
                  />
                  <InfoBlock
                    label="Contact Name"
                    value={detail?.client?.contactName ?? "—"}
                  />
                  <InfoBlock
                    label="Phone"
                    value={detail?.client?.phone ?? "—"}
                  />
                  <InfoBlock
                    label="Priority"
                    value={
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${PRIORITY_META[job.priority] ?? PRIORITY_META.LOW}`}
                      >
                        {job.priority}
                      </span>
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Assigned Technician
                  </p>
                  <div className="mt-2">
                    <TechChip technician={detail?.technician} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock label="Created" value={createdAt} mono />
                  <InfoBlock label="Last Updated" value={updatedAt} mono />
                </div>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
              <h2 className="text-sm font-semibold text-gray-900">
                Status History
              </h2>
              <div className="mt-6 space-y-5">
                {jobHistory.map((entry, index) => {
                  const entryMeta =
                    STATUS_META[entry.status] ?? STATUS_META.PENDING;
                  const label = entry.status.replaceAll("_", " ");
                  const timestamp = formatDateTime(entry.changedAt);

                  return (
                    <div
                      key={`${entry.status}-${entry.changedAt}-${index}`}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-3 w-3 rounded-full ${entryMeta.dot}`}
                        />
                        {index !== jobHistory.length - 1 ? (
                          <span className="mt-2 h-full w-px grow bg-slate-200" />
                        ) : null}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium text-gray-900">
                          {label} by {entry.changedByName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {timestamp}
                        </p>
                        {entry.note ? (
                          <p className="mt-2 text-sm text-gray-700">
                            {entry.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6 md:col-span-1">
            <section className="rounded-4xl bg-white p-6 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
              <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                >
                  Reassign Technician
                </button>

                {showVerify ? (
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Verify Job
                  </button>
                ) : null}

                {showVerify ? (
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject Completion
                  </button>
                ) : null}

                {showEditAndCancel ? (
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                  >
                    Edit Job Details
                  </button>
                ) : null}

                {showEditAndCancel ? (
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel Job
                  </button>
                ) : null}
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
              <h2 className="text-sm font-semibold text-gray-900">
                Job Details
              </h2>
              <div className="mt-5 space-y-4">
                {summaryFields.map((field) => (
                  <SummaryRow
                    key={field.label}
                    label={field.label}
                    value={field.value}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div
        className={`mt-2 text-sm text-gray-700 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-sm text-gray-700 text-right">{value}</span>
    </div>
  );
}

function formatDateTime(value) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} · ${time}`;
}
