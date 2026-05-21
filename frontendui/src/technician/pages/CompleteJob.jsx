import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import ErrorState from "../../shared/components/ErrorState";

export default function CompleteJob() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    </div>
  );
}
