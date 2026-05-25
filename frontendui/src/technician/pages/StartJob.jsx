import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Clock, Play, WifiOff, ChevronRight } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { formatFullDate } from "../../shared/utils/formatDate";
import Button from "../../shared/components/Button";
import PriorityBadge from "../../shared/components/PriorityBadge";

export default function StartJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useTechnicianData();
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);

  if (!job) {
    navigate("/tech/jobs", { replace: true });
    return null;
  }

  const client = getUserById(job.clientId);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(job.location)}`;

  async function handleStart() {
    setLoading(true);
    setNetworkError(false);
    try {
      if (import.meta.env.DEV && simulateFail) throw new Error("Simulated failure");
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateJobStatus(id, "IN_PROGRESS", null);
      navigate(`/tech/jobs/${id}`, { replace: true });
    } catch {
      setNetworkError(true);
    } finally {
      setLoading(false);
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useTechnicianData(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);
  const client = job ? getUserById(job.clientId) : null;

  if (!job || job.technicianId !== user?.id) {
    return (
      <div className="p-4 text-center">
        <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
          Job not found
        </p>
        <Link
          to="/tech/jobs"
          className="mt-4 inline-block text-[13px] text-brand-accent"
        >
          Back to My Jobs
        </Link>
      </div>
    );
  }

  async function handleStart() {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      updateJobStatus(job.id, "IN_PROGRESS", "Technician arrived on site");
      navigate(`/tech/jobs/${job.id}`, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 px-4 pb-8 pt-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Start Job</h1>
        <p className="text-sm text-gray-400 mt-0.5">Review the details before you begin</p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{job.id}</p>
            <h2 className="text-base font-bold text-gray-900 leading-snug">{job.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{client?.name ?? "Unknown client"}</p>
          </div>
          <div className="shrink-0">
            <PriorityBadge priority={job.priority} />
          </div>
          <h1
            className="mt-6 text-[22px] font-bold text-[#0F172A] dark:text-gray-50"
            style={{ letterSpacing: "-0.5px" }}
          >
            Start this job?
          </h1>
          <p className="mt-2 text-[13px] text-[#374151] dark:text-gray-300">
            Confirm you have arrived at the site and are ready to begin work on{" "}
            <span className="font-semibold">{job.title}</span>.
          </p>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <MapPin size={18} className="text-[#27AE60]" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
          <p className="text-sm font-medium text-[#2E86AB] mt-0.5 truncate">{job.location}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" aria-hidden />
      </a>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={13} className="text-gray-400" aria-hidden />
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Assigned</p>
          </div>

      {networkError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <WifiOff size={15} className="text-red-500" aria-hidden />
            <p className="text-sm font-semibold text-red-700">Connection failed</p>
          </div>
        </div>
      ) : null}

      {import.meta.env.DEV ? (
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={simulateFail}
            onChange={(e) => setSimulateFail(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60]"
          />
          Simulate network error
        </label>
      ) : null}

      <Button
        variant="primary"
        fullWidth
        loading={loading}
        onClick={handleStart}
        className="!h-14 !rounded-2xl !text-base !font-semibold"
      >
        <span className="flex items-center justify-center gap-2">
          <Play size={16} aria-hidden />
          Start This Job
        </span>
      </Button>

      <p className="text-center text-xs text-gray-400">
        Your start time will be recorded when you confirm
      </p>
    </div>
  );
}
