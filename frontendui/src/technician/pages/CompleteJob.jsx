import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, WifiOff } from "lucide-react";
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
  const inProgressEntry = job.statusHistory?.find(
    (e) => e.status === "IN_PROGRESS",
  );
  const elapsedTime = inProgressEntry
    ? formatElapsed(inProgressEntry.changedAt)
    : null;

  async function handleSubmit() {
    setLoading(true);
    setNetworkError(false);
    try {
      if (import.meta.env.DEV && simulateFail) {
        throw new Error("Simulated network failure");
      }
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={36} className="text-[#27AE60]" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-[#27AE60]">Job Submitted!</h1>
        <p className="mt-3 max-w-xs text-sm text-gray-600">
          <span className="font-medium">{job.title}</span> has been marked as
          completed and is awaiting admin verification.
        </p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="mt-8 w-full max-w-xs min-h-12 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-gray-700"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-8 pt-4">
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="font-semibold text-gray-900">{job.title}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          {client?.name ?? "Unknown client"}
        </p>
        {elapsedTime ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} aria-hidden />
            <span>{elapsedTime}</span>
          </div>
        ) : null}
      </section>

      {networkError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <WifiOff size={16} className="text-red-500" aria-hidden />
            <p className="text-sm font-medium text-red-700">Connection failed</p>
          </div>
          <p className="text-xs text-red-600">
            Your note is saved. Retry when you&apos;re back online.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 min-h-11 rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700"
          >
            Retry
          </button>
        </div>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-gray-700">
          Completion Note <span className="font-normal text-gray-400">(optional)</span>
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Describe the work you completed"
          className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#27AE60] focus:ring-2 focus:ring-[#27AE60]/20"
        />
      </label>

      {import.meta.env.DEV ? (
        <label className="flex min-h-11 items-center gap-2 text-xs text-gray-500">
          <input
            type="checkbox"
            checked={simulateFail}
            onChange={(e) => setSimulateFail(e.target.checked)}
          />
          Simulate network error
        </label>
      ) : null}

      <Button
        variant="success"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
        className="!min-h-[48px]"
      >
        Submit as Complete
      </Button>
      <p className="text-center text-xs text-gray-400">
        Admin will verify before the job is closed
      </p>
    </div>
  );
}
