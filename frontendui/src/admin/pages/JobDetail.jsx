import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import TechChip from "../components/TechChip";
import { useAdminData } from "../hooks/useAdminData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import { JobDetailPageSkeleton } from "../../shared/components/skeletons/PageSkeletons";
import EmptyState from "../../shared/components/EmptyState";
import VerifyModal from "../components/modals/VerifyModal";
import ReassignModal from "../components/modals/ReassignModal";
import CancelModal from "../components/modals/CancelModal";

const STATUS_META = {
  PENDING: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  IN_PROGRESS: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  COMPLETED: {
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    bar: "bg-green-500",
  },
  VERIFIED: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    bar: "bg-brand-navy",
  },
  CANCELLED: {
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
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
  const { jobs, loading, error, refetch } = useAdminData();

  const job = useMemo(
    () => jobs.find((entry) => entry.id === id) ?? null,
    [jobs, id],
  );

  const detail = useMemo(() => {
    if (!job) return null;
    return {
      client: job.client ?? null,
      technician: job.technician ?? null,
    };
  }, [job]);

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="job"
      onRetry={refetch}
      skeleton={() => <JobDetailPageSkeleton />}
      className="min-h-screen bg-brand-bg"
    >
      {!job ? (
        <EmptyState
          icon="🔎"
          title="Job not found"
          subtitle="This job may have been removed or the link is incorrect."
          action={{ to: "/admin/jobs", label: "View All Jobs" }}
        />
      ) : (
        <JobDetailContent job={job} detail={detail} navigate={navigate} />
      )}
    </AsyncPageContent>
  );
}

function JobDetailContent({ job, detail, navigate }) {
  const [modal, setModal] = useState(null);
  const { verifyJob, rejectJob, reassignJob, cancelJob, technicians } = useAdminData();

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
    <div className="min-h-screen bg-brand-bg p-6 dark:bg-gray-950">
      <div className="space-y-5">
        {/* Header card */}
        <div className="fs-card flex flex-col gap-4 border border-transparent p-5 dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-start md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="fs-focus-ring inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-accent hover:underline dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft size={14} />
              All Jobs
            </button>
            <p className="mt-3 font-mono text-[10px] text-gray-400 dark:text-gray-500">
              {job.jobNumber}
            </p>
            <h1 className="mt-1 text-[20px] font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl">
              {job.title}
            </h1>
          </div>
          <span
            className={`inline-flex h-fit rounded-badge border px-3 py-1 text-[12px] font-medium ${meta.badge}`}
          >
            {job.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Content grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Left column */}
          <div className="space-y-5 md:col-span-2">
            {/* Job info */}
            <section className="fs-card border border-transparent p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className={`mb-4 h-1 w-16 rounded-full ${meta.bar}`} />
              <h2 className="fs-card-title">Job Information</h2>

              <div className="mt-4 space-y-5 text-[13px] text-gray-700 dark:text-gray-200">
                <div>
                  <p className="fs-label mb-1.5 text-gray-400 dark:text-gray-400">Description</p>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-200">
                    {job.description}
                  </p>
                </div>

                <div>
                  <p className="fs-label mb-1.5 text-gray-400 dark:text-gray-400">Location</p>
                  <div className="flex gap-3">
                    <div
                      className="grid h-14 w-20 shrink-0 place-items-center rounded-card border border-black/5 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-800"
                      aria-hidden
                    >
                      <MapPin size={16} />
                    </div>
                    <a
                      href={locationHref}
                      target="_blank"
                      rel="noreferrer"
                      className="self-center text-[13px] font-medium text-brand-accent hover:underline"
                    >
                      {job.location}
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock
                    label="Client"
                    value={detail?.client?.companyName ?? "Unknown client"}
                  />
                  <div>
                    <p className="fs-label mb-1 text-gray-400 dark:text-gray-400">
                      Notification Email
                    </p>
                    <a
                      href={
                        job.clientEmail
                          ? `mailto:${job.clientEmail}`
                          : undefined
                      }
                      className="text-[13px] font-medium text-brand-accent hover:underline"
                    >
                      {job.clientEmail ?? "—"}
                    </a>
                    <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                      This email receives status update notifications.
                    </p>
                  </div>
                  <div>
                    <p className="fs-label mb-1 text-gray-400 dark:text-gray-400">Phone</p>
                    <a
                      href={
                        job.clientPhone
                          ? `tel:${job.clientPhone.replace(/\s/g, "")}`
                          : undefined
                      }
                      className="text-[13px] font-medium text-gray-700 hover:text-brand-accent hover:underline dark:text-gray-200"
                    >
                      {job.clientPhone ?? "—"}
                    </a>
                  </div>
                  <div>
                    <p className="fs-label mb-1 text-gray-400 dark:text-gray-400">Address</p>
                    <a
                      href={
                        job.clientAddress
                          ? `https://maps.google.com/?q=${encodeURIComponent(job.clientAddress)}`
                          : undefined
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[13px] font-medium text-gray-700 hover:text-brand-accent hover:underline dark:text-gray-200"
                    >
                      {job.clientAddress ?? "—"}
                    </a>
                  </div>
                  <InfoBlock
                    label="Priority"
                    value={
                      <span
                        className={`inline-flex rounded-badge border px-2.5 py-0.5 text-[11px] font-medium ${PRIORITY_META[job.priority] ?? PRIORITY_META.LOW}`}
                      >
                        {job.priority}
                      </span>
                    }
                  />
                </div>

                <div>
                  <p className="fs-label mb-1.5 text-gray-400 dark:text-gray-400">
                    Assigned Technician
                  </p>
                  <TechChip technician={detail?.technician} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock label="Created" value={createdAt} mono />
                  <InfoBlock label="Last Updated" value={updatedAt} mono />
                </div>
              </div>
            </section>

            {/* Status history */}
            <section className="fs-card border border-transparent p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="fs-card-title">Status History</h2>
              <div className="mt-5 space-y-4">
                {jobHistory.map((entry, index) => {
                  const entryMeta =
                    STATUS_META[entry.status] ?? STATUS_META.PENDING;
                  const label = entry.status.replaceAll("_", " ");
                  const timestamp = formatDateTime(entry.changedAt);

                  return (
                    <div
                      key={`${entry.status}-${entry.changedAt}-${index}`}
                      className="flex gap-4 rounded-card border border-black/5 border-l-2 border-l-brand-accent/30 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex flex-col items-center pt-0.5">
                        <span
                          className={`rounded-full ${entryMeta.dot} ${
                            index === 0 ? "h-2 w-2" : "h-1.5 w-1.5"
                          } ${index === 0 && entry.status === "IN_PROGRESS" ? "animate-pulse-dot" : ""}`}
                        />
                        {index !== jobHistory.length - 1 && (
                          <span className="mt-2 min-h-8 w-px grow bg-linear-to-b from-brand-accent/30 to-gray-200 dark:bg-gray-700" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-200">
                          {label} by {entry.changedByName}
                        </p>
                        <p className="fs-muted mt-0.5 dark:text-gray-500">{timestamp}</p>
                        {entry.note && (
                          <p className="mt-2 text-[13px] text-gray-600 dark:text-gray-300">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-5">
            {/* Actions */}
            <section className="fs-card border border-transparent p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="fs-card-title">Actions</h2>
              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setModal("reassign")}
                  className="fs-focus-ring w-full rounded-button border border-black/8 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-brand-accent hover:text-brand-accent"
                >
                  Reassign Technician
                </button>

                {showVerify && (
                  <button
                    type="button"
                    onClick={() => setModal("verify")}
                    className="fs-focus-ring w-full rounded-button bg-green-600 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-green-700"
                  >
                    Verify Job
                  </button>
                )}

                {showVerify && (
                  <button
                    type="button"
                    onClick={() => rejectJob(job.id)}
                    className="fs-focus-ring w-full rounded-button border border-red-200 bg-white px-4 py-2.5 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Reject Completion
                  </button>
                )}

                {showEditAndCancel && (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/jobs/new`)}
                    className="fs-focus-ring w-full rounded-button border border-black/8 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-brand-accent hover:text-brand-accent"
                  >
                    Edit Job Details
                  </button>
                )}

                {showEditAndCancel && (
                  <button
                    type="button"
                    onClick={() => setModal("cancel")}
                    className="fs-focus-ring w-full rounded-button px-4 py-2.5 text-[13px] font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Cancel Job
                  </button>
                )}
              </div>
            </section>

            {/* Job details summary */}
            <section className="fs-card border border-transparent p-5 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="fs-card-title">Job Details</h2>
              <div className="mt-4 space-y-0">
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

      {modal === "verify" && (
        <VerifyModal
          job={job}
          onConfirm={() => verifyJob(job.id)}
          onReject={() => rejectJob(job.id)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "reassign" && (
        <ReassignModal
          job={job}
          currentTechnician={job.technician}
          technicians={technicians}
          onConfirm={(techId) => reassignJob(job.id, techId)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "cancel" && (
        <CancelModal
          jobId={job.id}
          jobTitle={job.title}
          onConfirm={() => {
            cancelJob(job.id);
            navigate("/admin/jobs");
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function InfoBlock({ label, value, mono = false }) {
  return (
    <div>
      <p className="fs-label mb-1 text-gray-400 dark:text-gray-400">{label}</p>
      <div
        className={`text-[13px] text-gray-700 dark:text-gray-200 ${mono ? "font-mono text-[11px]" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 items-center gap-3 border-b border-black/5 py-2.5 last:border-0 dark:border-gray-800">
      <span className="fs-label text-gray-400 dark:text-gray-400">{label}</span>
      <span className="text-right text-[12px] text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
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
