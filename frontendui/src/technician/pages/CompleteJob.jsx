import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import Button from "../../shared/components/Button";
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
        <p className="font-semibold text-gray-900">Job not found</p>
        <Link to="/tech/jobs" className="mt-4 inline-block text-[#2E86AB]">
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
      if (simulateNetworkError) {
        throw new Error("Network error. Please try again.");
      }
      updateJobStatus(job.id, "COMPLETED", note.trim() || null);
      navigate(`/tech/jobs/${job.id}`, { replace: true });
    } catch (err) {
      setSubmitError(err?.message ?? "Unable to submit completion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-4 pb-8">
      <Link
        to={`/tech/jobs/${job.id}`}
        className="flex min-h-11 items-center gap-2 text-sm font-medium text-[#2E86AB]"
      >
        <ArrowLeft size={18} aria-hidden />
        Back
      </Link>

      <section className="fs-card p-5">
        <h1 className="text-xl font-bold text-gray-900">Mark job complete</h1>
        <p className="mt-2 text-[13px] text-gray-600">{job.title}</p>
      </section>

      {submitError ? (
        <ErrorState
          thing="completion"
          message={submitError}
          onRetry={() => setSubmitError(null)}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="fs-label text-gray-500">
            Completion note <span className="normal-case text-gray-400">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Describe work completed..."
            className="mt-1.5 w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-[3px] focus:ring-[#2E86AB]/15 md:text-[13px]"
            style={{ minHeight: "80px" }}
          />
        </label>

        <div className="fs-card flex h-32 flex-col items-center justify-center border-dashed p-4">
          <Camera className="text-gray-300" size={32} aria-hidden />
          <p className="mt-2 text-xs text-gray-400">Photo upload (coming soon)</p>
        </div>

        {import.meta.env.DEV ? (
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={simulateNetworkError}
              onChange={(e) => setSimulateNetworkError(e.target.checked)}
            />
            Simulate network error
          </label>
        ) : null}

        <Button type="submit" fullWidth size="lg" variant="success" loading={isSubmitting}>
          Submit completion
        </Button>
      </form>
    </div>
  );
}
