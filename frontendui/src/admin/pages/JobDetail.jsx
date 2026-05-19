import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import TechChip from "../components/TechChip";
import { useAdminData } from "../hooks/useAdminData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import EmptyState from "../../shared/components/EmptyState";
import VerifyModal from "../components/modals/VerifyModal";
import ReassignModal from "../components/modals/ReassignModal";
import CancelModal from "../components/modals/CancelModal";

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
  const { jobs, loading, error, refetch } = useAdminData();

  const job = useMemo(
    () => jobs.find((entry) => entry.id === id) ?? null,
    [jobs, id],
  );

  const detail = useMemo(() => {
    if (!job) {
      return null;
    }

    const client = getUserById(job.clientId);
    const technician = getUserById(job.technicianId);

    return { client, technician };
  }, [job]);

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="job"
      onRetry={refetch}
      className="min-h-screen bg-[#f5f2ee]"
    >
      {!job ? (
        <EmptyState
          icon="🔎"
          title="Job not found"
          subtitle="This job may have been removed or the link is incorrect."
          action={{ to: "/admin/jobs", label: "View All Jobs" }}
        />
      ) : (
        <JobDetailContent
          job={job}
          detail={detail}
          navigate={navigate}
        />
      )}
    </AsyncPageContent>
  );
}

function JobDetailContent({ job, detail, navigate }) {
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
    <div className="min-h-screen bg-[#f5f2ee] p-6">
      <div className="space-y-6">
        <div className="fs-card flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
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
            <section className="fs-card p-5">
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
                  <p className="fs-label text-gray-500">Location</p>
                  <div className="mt-2 flex gap-3">
                    <div
                      className="grid h-16 w-24 shrink-0 place-items-center rounded-lg border border-[#E5E7EB] bg-[linear-gradient(#f3f4f6_1px,transparent_1px),linear-gradient(90deg,#f3f4f6_1px,transparent_1px)] bg-[length:8px_8px] text-[#9CA3AF]"
                      aria-hidden
                    >
                      <MapPin size={18} />
                    </div>
                    <a
                      href={locationHref}
                      target="_blank"
                      rel="noreferrer"
                      className="self-center text-[13px] font-medium text-[#2E86AB] hover:underline"
                    >
                      {job.location}
                    </a>
                  </div>
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

            <section className="fs-card p-5">
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
                      className="flex gap-4 rounded-xl border border-[#E5E7EB] border-l-[3px] border-l-[#2E86AB]/50 bg-[#FAFAFA] p-4"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`rounded-full ${entryMeta.dot} ${index === 0 ? "h-2 w-2" : "h-1.5 w-1.5"} ${index === 0 && entry.status === "IN_PROGRESS" ? "animate-pulse-dot" : ""}`}
                        />
                        {index !== jobHistory.length - 1 ? (
                          <span className="mt-2 min-h-8 w-px grow bg-gradient-to-b from-[#2E86AB]/40 to-slate-200" />
                        ) : null}
                      </div>
                      <div className="pb-1">
                        <p className="text-[13px] font-medium text-gray-900">
                          {label} by {entry.changedByName}
                        </p>
                        <p className="fs-muted mt-1">
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
            <section className="fs-card p-5">
              <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setModal("reassign")}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                >
                  Reassign Technician
                </button>

                {showVerify ? (
                  <button
                    type="button"
                    onClick={() => setModal("verify")}
                    className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Verify Job
                  </button>
                ) : null}

                {showVerify ? (
                  <button
                    type="button"
                    onClick={() => {
                      rejectJob(job.id);
                    }}
                    className="w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject Completion
                  </button>
                ) : null}

                {showEditAndCancel ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/jobs/new`)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                  >
                    Edit Job Details
                  </button>
                ) : null}

                {showEditAndCancel ? (
                  <button
                    type="button"
                    onClick={() => setModal("cancel")}
                    className="w-full rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel Job
                  </button>
                ) : null}
              </div>
            </section>

            <section className="fs-card p-5">
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

      {modal === "verify" ? (
        <VerifyModal
          job={job}
          onConfirm={() => verifyJob(job.id)}
          onReject={() => rejectJob(job.id)}
          onClose={() => setModal(null)}
        />
      ) : null}
      {modal === "reassign" ? (
        <ReassignModal
          jobId={job.id}
          currentTechnicianId={job.technicianId}
          onConfirm={(techId) => reassignJob(job.id, techId)}
          onClose={() => setModal(null)}
        />
      ) : null}
      {modal === "cancel" ? (
        <CancelModal
          jobId={job.id}
          jobTitle={job.title}
          onConfirm={() => {
            cancelJob(job.id);
            navigate("/admin/jobs");
          }}
          onClose={() => setModal(null)}
        />
      ) : null}
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
    <div className="grid grid-cols-2 items-center gap-3 border-b border-[#E5E7EB] py-2.5 last:border-0">
      <span className="fs-label text-gray-500">{label}</span>
      <span className="text-right text-[13px] text-gray-800">{value}</span>
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
