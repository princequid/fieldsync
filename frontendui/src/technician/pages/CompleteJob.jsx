import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, WifiOff, FileText } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { formatElapsed } from "../../shared/utils/formatDate";
import Button from "../../shared/components/Button";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import ErrorState from "../../shared/components/ErrorState";
import FormTransition from "../../shared/components/FormTransition";

export default function CompleteJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useTechnicianData();
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [simulateFail, setSimulateFail] = useState(false);

  if (!job) {
    navigate("/tech/jobs", { replace: true });
    return null;
  }

  const client = getUserById(job.clientId);
  const inProgressEntry = job.statusHistory?.find((e) => e.status === "IN_PROGRESS");
  const elapsedTime = inProgressEntry ? formatElapsed(inProgressEntry.changedAt) : null;

  async function handleSubmit() {
    setLoading(true);
    setNetworkError(false);
    try {
      if (import.meta.env.DEV && simulateFail) throw new Error("Simulated network failure");
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateJobStatus(id, "COMPLETED", note.trim() || null);
      setSuccess(true);
    } catch {
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <CheckCircle2 size={40} className="text-[#27AE60]" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Job Submitted!</h1>
        <p className="mt-2 max-w-xs text-sm text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">{job.title}</span> has been marked as
          completed and is awaiting admin verification.
        </p>
        <div className="mt-8 w-full max-w-xs space-y-3">
          <button
            type="button"
            onClick={() => navigate("/tech/jobs")}
            className="w-full h-12 rounded-2xl bg-[#27AE60] text-sm font-semibold text-white active:scale-[0.98] transition-transform"
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-8 pt-5">

      {/* page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Complete Job</h1>
        <p className="text-sm text-gray-400 mt-0.5">Add a note and submit for verification</p>
      </div>

      {/* job summary */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#27AE60]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 leading-snug">{job.title}</p>
            <p className="text-sm text-gray-400 mt-0.5">{client?.name ?? "Unknown client"}</p>
            {elapsedTime ? (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={11} aria-hidden />
                <span>{elapsedTime} elapsed</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* network error */}
      {networkError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <WifiOff size={15} className="text-red-500" aria-hidden />
            <p className="text-sm font-semibold text-red-700">Connection failed</p>
          </div>
          <p className="text-xs text-red-500 leading-relaxed">
            Your note is saved locally. Retry when you&apos;re back online.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 h-10 px-4 rounded-xl bg-red-100 text-sm font-semibold text-red-700 active:scale-[0.98] transition-transform"
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* note input */}
      <div>
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-gray-400" aria-hidden />
            <span className="text-sm font-medium text-gray-700">
              Completion Note{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </span>
          </div>
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useTechnicianData(user?.id);

  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  if (!job || job.technicianId !== user?.id) {
    return (
      <div className="p-4 text-center">
        <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">Job not found</p>
        <Link
          to="/tech/jobs"
          className="mt-4 inline-block text-[13px] text-brand-accent"
        >
          Back to My Jobs
        </Link>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (simulateNetworkError)
        throw new Error("Network error. Please try again.");
      updateJobStatus(job.id, "COMPLETED", note.trim() || null);
      navigate(`/tech/jobs/${job.id}`, { replace: true });
    } catch (err) {
      setSubmitError(err?.message ?? "Unable to submit completion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 p-4 pb-8">
      <Link
        to={`/tech/jobs/${job.id}`}
        className="fs-focus-ring flex h-11 items-center gap-2 text-[13px] font-medium text-brand-accent"
      >
        <ArrowLeft size={16} aria-hidden />
        Back
      </Link>

      <section className="fs-card p-5">
        <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
          Mark job complete
        </h1>
        <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">{job.title}</p>
      </section>

      {submitError && (
        <ErrorState
          thing="completion"
          message={submitError}
          onRetry={() => setSubmitError(null)}
        />
      )}

      <FormTransition submitting={isSubmitting}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="fs-label mb-1.5 block text-gray-400 dark:text-gray-500">
            Completion note{" "}
            <span className="normal-case text-gray-300">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Describe the work you completed…"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-[#27AE60] focus:ring-2 focus:ring-[#27AE60]/15 transition-shadow"
          />
        </label>
      </div>

      {/* dev toggle */}
      {import.meta.env.DEV ? (
        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={simulateFail}
            onChange={(e) => setSimulateFail(e.target.checked)}
          />
          Simulate network error
        </label>
      ) : null}

      {/* submit */}
      <Button
        variant="success"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
        className="!h-14 !rounded-2xl !text-base !font-semibold"
      >
        Submit as Complete
      </Button>

      <p className="text-center text-xs text-gray-400">
        Admin will verify before the job is officially closed
      </p>
    </div>
  );
}
            placeholder="Describe work completed…"
            className="w-full resize-y rounded-input border border-black/8 bg-white px-3 py-3 text-[16px] text-gray-900 outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 md:text-[13px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
            style={{ minHeight: "80px" }}
          />
        </label>

        {/* Photo upload placeholder */}
        <div className="fs-card flex h-28 flex-col items-center justify-center border-dashed p-4">
          <Camera className="text-gray-300 dark:text-gray-600" size={28} aria-hidden />
          <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
            Photo upload (coming soon)
          </p>
        </div>

        {import.meta.env.DEV && (
          <label className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-500">
            <input
              type="checkbox"
              checked={simulateNetworkError}
              onChange={(e) => setSimulateNetworkError(e.target.checked)}
            />
            Simulate network error
          </label>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="fs-btn-press fs-focus-ring relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[12px] bg-linear-to-b from-[#22C55E] to-[#16A34A] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-[40%]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.15), transparent)",
            }}
          />
          {isSubmitting ? "Submitting..." : "Submit as Complete"}
        </button>
      </form>
      </FormTransition>
    </div>
  );
}
