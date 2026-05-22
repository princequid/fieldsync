import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, WifiOff, FileText } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { formatElapsed } from "../../shared/utils/formatDate";
import Button from "../../shared/components/Button";

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