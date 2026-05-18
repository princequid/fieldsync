import { useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";

const STATUS_BANNER = {
  PENDING: {
    wrapper: "border-amber-200 bg-amber-50",
    text: "text-gray-800",
    icon: "⏳",
    static: "Waiting for you to start · Tap the button below when you arrive on-site",
  },
  IN_PROGRESS: {
    wrapper: "border-blue-200 bg-blue-50",
    text: "text-gray-800",
    icon: "🔧",
    static: null,
  },
  COMPLETED: {
    wrapper: "border-green-200 bg-green-50",
    text: "text-gray-800",
    icon: "✅",
    static: null,
  },
  VERIFIED: {
    wrapper: "border-transparent",
    text: "text-white",
    icon: "🏆",
    static: null,
    style: { backgroundColor: "#1a2e1a" },
  },
};

const STATUS_DOT = {
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-amber-400",
  COMPLETED: "bg-green-500",
  VERIFIED: "bg-slate-400",
  CANCELLED: "bg-red-500",
};

const ACTION = {
  PENDING: {
    label: "▶  Start This Job",
    cls: "text-white hover:opacity-90",
    style: { backgroundColor: "#2E86AB" },
    disabled: false,
  },
  IN_PROGRESS: {
    label: "✓  Mark as Complete",
    cls: "text-white hover:opacity-90",
    style: { backgroundColor: "#27AE60" },
    disabled: false,
  },
  COMPLETED: {
    label: "Awaiting admin verification…",
    cls: "cursor-not-allowed bg-gray-200 text-gray-400",
    style: {},
    disabled: true,
  },
  VERIFIED: {
    label: "✓  This job is closed",
    cls: "cursor-not-allowed bg-gray-100 text-gray-500",
    style: {},
    disabled: true,
  },
};

export default function TechJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useOutletContext();

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  if (!job) {
    navigate("/403", { replace: true });
    return null;
  }

  const client = getUserById(job.clientId);
  const locationHref = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;

  // Build banner message
  const banner = STATUS_BANNER[job.status] ?? STATUS_BANNER.PENDING;
  let bannerMsg = banner.static;

  const inProgressEntry = job.statusHistory?.find(
    (e) => e.status === "IN_PROGRESS",
  );
  const completedEntry = job.statusHistory?.find(
    (e) => e.status === "COMPLETED",
  );
  const verifiedEntry = job.statusHistory?.find(
    (e) => e.status === "VERIFIED",
  );

  if (job.status === "IN_PROGRESS" && inProgressEntry) {
    bannerMsg = `You're on this job · Started at ${fmtTime(inProgressEntry.changedAt)} · ${elapsed(inProgressEntry.changedAt)} elapsed`;
  } else if (job.status === "COMPLETED" && completedEntry) {
    bannerMsg = `Awaiting admin verification · Completed at ${fmtTime(completedEntry.changedAt)}`;
  } else if (job.status === "VERIFIED" && verifiedEntry) {
    bannerMsg = `Job Verified & Closed · Admin verified on ${fmtDate(verifiedEntry.changedAt)}`;
  }

  const action = ACTION[job.status] ?? ACTION.PENDING;

  function handleAction() {
    if (job.status === "PENDING") navigate(`/tech/jobs/${id}/start`);
    else if (job.status === "IN_PROGRESS") navigate(`/tech/jobs/${id}/complete`);
  }

  const showTimeline =
    job.status === "COMPLETED" || job.status === "VERIFIED";

  return (
    <div className="flex min-h-full flex-col">
      {/* Scrollable content area */}
      <div className="flex-1">
        {/* Status banner */}
        <div
          className={`border-b px-4 py-3 ${banner.wrapper}`}
          style={banner.style}
        >
          <p className={`text-sm font-medium ${banner.text}`}>
            {banner.icon} {bannerMsg}
          </p>
        </div>

        <div className="space-y-4 p-4">
          {/* Job info card */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {client?.name ?? "Unknown client"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {job.description}
            </p>

            {/* Location */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Location
              </p>
              <div className="mt-1 flex items-start gap-2">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                <div>
                  <p className="text-sm text-gray-700">{job.location}</p>
                  <a
                    href={locationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 inline-block text-xs font-medium text-[#27AE60]"
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="relative mt-3 overflow-hidden rounded-xl bg-green-100"
              style={{ height: "120px" }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 opacity-20"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 20}
                    x2="100%"
                    y2={i * 20}
                    stroke="#27AE60"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 20}
                    y1="0"
                    x2={i * 20}
                    y2="100%"
                    stroke="#27AE60"
                    strokeWidth="1"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">📍</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Contact card */}
          {client && (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Contact
              </p>
              <p className="text-sm font-medium text-gray-900">
                {client.contactName ?? client.name}
              </p>
              {client.phone && (
                <a
                  href={`tel:${client.phone}`}
                  className="mt-2 flex items-center gap-2 font-medium text-[#27AE60]"
                  style={{ minHeight: "44px" }}
                >
                  <Phone size={16} />
                  <span className="text-sm">{client.phone}</span>
                  <span className="text-xs text-gray-400">· Call</span>
                </a>
              )}
            </section>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <QuickStat label="Assigned" value={fmtDate(job.createdAt)} />
            <QuickStat
              label="Priority"
              value={job.priority}
              valueClass={
                job.priority === "HIGH"
                  ? "text-red-600"
                  : job.priority === "MEDIUM"
                    ? "text-amber-600"
                    : "text-green-600"
              }
            />
          </div>

          {/* Status timeline */}
          {showTimeline && (job.statusHistory?.length ?? 0) > 0 && (
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">
                Status History
              </p>
              <div className="space-y-0">
                {job.statusHistory.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[entry.status] ?? "bg-gray-400"}`}
                      />
                      {i < job.statusHistory.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-slate-200" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        {entry.status.replaceAll("_", " ")} by{" "}
                        {entry.changedByName}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-gray-400">
                        {fmtDateTime(entry.changedAt)}
                      </p>
                      {entry.note && (
                        <p className="mt-1 text-sm text-gray-600">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky action button */}
      <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={handleAction}
          disabled={action.disabled}
          className={`w-full rounded-2xl px-4 text-sm font-semibold transition-opacity ${action.cls}`}
          style={{ minHeight: "52px", ...action.style }}
        >
          {action.label}
        </button>
      </div>
    </div>
  );
}

function QuickStat({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function fmtTime(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function fmtDate(iso) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function fmtDateTime(iso) {
  const date = new Date(iso);
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

function elapsed(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const totalMins = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}
