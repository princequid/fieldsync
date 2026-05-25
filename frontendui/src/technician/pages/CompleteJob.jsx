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
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useTechnicianData(user?.id);

  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (simulateNetworkError)
        throw new Error("Network error. Please try again.");
      updateJobStatus(job.id, "COMPLETED", note.trim() || null);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError(err?.message ?? "Unable to submit completion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F0EDE8] dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[12px] bg-white dark:bg-gray-900 p-6 text-center">
          <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#DCFCE7] dark:bg-green-900/30">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="36"
                cy="36"
                r="34"
                fill="none"
                stroke="#DCFCE7"
                strokeWidth="0"
              />
              <path
                id="check"
                d="M22 37l8 8 20-20"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset="100"
                style={{ animation: "drawCheck 500ms ease-out forwards" }}
              />
              <style>{`@keyframes drawCheck{to{stroke-dashoffset:0}}`}</style>
            </svg>
          </div>
          <h2
            className="text-[22px] font-bold text-[#15803D] dark:text-green-400"
            style={{ letterSpacing: "-0.5px" }}
          >
            Job Submitted!
          </h2>
          <p
            className="mt-3 text-[14px] text-[#374151] dark:text-gray-400 mx-auto"
            style={{ maxWidth: 280 }}
          >
            Thanks — your completion has been sent. Your admin will verify this
            job before it's closed.
          </p>
          <button
            onClick={() => navigate("/tech/jobs")}
            className="mt-4 w-full h-12 rounded-[12px] text-white"
            style={{ background: "linear-gradient(180deg,#2E86AB,#1A6FA8)" }}
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE8] dark:bg-gray-950">
      <div
        className="max-w-md mx-auto mt-6 bg-white dark:bg-gray-900 rounded-[12px]"
        style={{ margin: "0 24px" }}
      >
        <div style={{ padding: 20 }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[16px] font-semibold text-[#0F172A] dark:text-gray-50">
                Mark job complete
              </h1>
              <p className="mt-1 text-[12px] text-[#64748B] dark:text-gray-400">
                {job.title}
              </p>
            </div>
            <div className="ml-3">
              <span className="inline-block bg-[#EFF6FF] dark:bg-blue-900/30 text-[#2E86AB] font-mono text-[10px] px-3 py-1 rounded-badge">
                {job.elapsed ?? "—"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "#F1F5F9" }} />

        {submitError && (
          <div
            className="p-4"
            style={{ background: "#FEF2F2", borderLeft: "4px solid #EF4444" }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 text-[#EF4444]">
                <Camera size={16} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#991B1B]">
                  Connection failed
                </p>
                <p className="text-[12px] text-[#DC2626]">{submitError}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => {
                    setSubmitError(null);
                  }}
                  className="h-9 px-3 rounded border border-[#EF4444] text-[#EF4444]"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: 16 }}>
          <FormTransition submitting={isSubmitting}>
            <form onSubmit={handleSubmit}>
              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] dark:text-gray-400">
                    Completion Note
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">optional</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the work you completed…"
                  className="w-full resize-y rounded-input border border-black/8 bg-white px-3 py-3 text-[13px] text-gray-900 outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600"
                  style={{ minHeight: 100, marginTop: 8 }}
                />
              </label>

              <div
                className="mt-4"
                style={{
                  background: "white",
                  padding: 16,
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-[12px] text-white font-semibold"
                  style={{
                    background: "linear-gradient(180deg,#22C55E,#16A34A)",
                    boxShadow: "0 2px 8px rgba(34,197,94,0.35)",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit as Complete"}
                </button>
                <p className="mt-3 text-center text-[12px] text-[#94A3B8] dark:text-gray-500">
                  Your admin will verify before the job is closed
                </p>
              </div>
            </form>
          </FormTransition>
        </div>
      </div>
    </div>
  );
}
