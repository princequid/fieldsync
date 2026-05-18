import { useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle2, Clock, WifiOff } from "lucide-react";
import { getUserById } from "../../shared/utils/mockData";

export default function CompleteJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useOutletContext();
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  if (!job) {
    navigate("/tech/jobs", { replace: true });
    return null;
  }

  const client = getUserById(job.clientId);
  const inProgressEntry = job.statusHistory?.find(
    (e) => e.status === "IN_PROGRESS",
  );
  const elapsedTime = inProgressEntry
    ? elapsed(inProgressEntry.changedAt)
    : null;

  async function handleSubmit() {
    setLoading(true);
    setNetworkError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateJobStatus(id, "COMPLETED", note || null);
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setNetworkError(true);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={36} className="text-[#27AE60]" />
        </div>
        <h1 className="text-2xl font-bold text-[#27AE60]">Job Submitted!</h1>
        <p className="mt-3 max-w-xs text-sm text-gray-600">
          <span className="font-medium">{job.title}</span> has been marked as
          completed. Awaiting admin verification.
        </p>
        <button
          type="button"
          onClick={() => navigate("/tech/jobs")}
          className="mt-8 w-full max-w-xs rounded-2xl border border-slate-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:border-[#27AE60] hover:text-[#27AE60]"
          style={{ minHeight: "52px" }}
        >
          ← Back to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-8 pt-4">
      {/* In-page header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/tech/jobs/${id}`)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-600 transition-colors hover:border-[#27AE60] hover:text-[#27AE60]"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="font-mono text-xs text-gray-400">{job.jobNumber}</p>
          <p className="font-semibold text-gray-900">Mark as Complete</p>
        </div>
      </div>

      {/* Network error */}
      {networkError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <WifiOff size={16} className="text-red-500" />
            <p className="text-sm font-medium text-red-700">
              Connection failed
            </p>
          </div>
          <p className="text-xs text-red-600">
            Your note is saved. Tap retry when you're back online.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-3 rounded-xl bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Job summary card */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="font-semibold text-gray-900">{job.title}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          {client?.name ?? "Unknown client"}
        </p>
        {elapsedTime && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={12} />
            <span>Elapsed: {elapsedTime}</span>
          </div>
        )}
      </section>

      {/* Completion note */}
      <section>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Completion Note{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Describe the work you completed…"
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#27AE60] focus:ring-2 focus:ring-[#27AE60]/20"
          />
        </label>
      </section>

      {/* Photo attachment — stretch goal */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Attach Photo
          </span>
          <span className="text-xs font-normal text-gray-400">(optional)</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Stretch
          </span>
        </div>
        {photo ? (
          <div>
            <img
              src={photo}
              alt="Completion"
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: "200px" }}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white text-sm text-gray-600 transition-colors hover:border-red-300 hover:text-red-600"
                style={{ minHeight: "44px" }}
              >
                Retake
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ minHeight: "44px", backgroundColor: "#27AE60" }}
              >
                Use This Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Camera size={32} className="text-slate-300" />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-[#27AE60] hover:text-[#27AE60]"
                  style={{ minHeight: "44px" }}
                >
                  Camera
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-[#27AE60] hover:text-[#27AE60]"
                  style={{ minHeight: "44px" }}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ minHeight: "52px", backgroundColor: "#27AE60" }}
        >
          {loading ? "Submitting…" : "Submit as Complete"}
        </button>
        <p className="mt-2 text-center text-xs text-gray-400">
          Admin will verify before the job is closed
        </p>
      </div>
    </div>
  );
}

function elapsed(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const totalMins = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}
