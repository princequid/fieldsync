import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";

export default function StartJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useTechnicianData(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);
  const client = job?.client ?? null;

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
    <div className="min-h-[60vh] bg-[#F0EDE8] dark:bg-gray-950 flex items-start justify-center py-8 px-6">
      <div
        className="w-full max-w-md rounded-card bg-white dark:bg-gray-900 shadow-2 p-6"
        style={{ margin: "0 24px" }}
      >
        <Link
          to={`/tech/jobs/${job.id}`}
          className="fs-focus-ring flex items-center gap-2 text-[13px] font-medium text-[#2E86AB] mb-3"
        >
          <ArrowLeft size={16} aria-hidden />
          Back
        </Link>

        <div className="flex flex-col items-center text-center">
          <div
            className="rounded-full grid place-items-center"
            aria-hidden
            style={{
              width: 72,
              height: 72,
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E86AB"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 4v4h6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8h6V4z" />
            </svg>
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

          <div
            className="mt-4 w-full rounded-card bg-[#F8FAFC] dark:bg-gray-800 border p-4"
            style={{ border: "1px solid #F1F5F9" }}
          >
            <p className="text-[14px] font-semibold text-[#374151] dark:text-gray-200">
              {job.title}
            </p>
            <p className="mt-1 text-[12px] text-[#64748B] dark:text-gray-400">
              {job.location}
            </p>
          </div>

          <div className="mt-5 w-full">
            <div className="space-y-2">
              {[
                "Update status to In Progress",
                "Notify your admin",
                "Start the job timer",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2E86AB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <p className="text-[13px] text-[#374151] dark:text-gray-300">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 w-full">
            <button
              type="button"
              onClick={handleStart}
              disabled={isSubmitting}
              className="w-full h-13 rounded-card text-white font-semibold"
              style={{ background: "#2E86AB" }}
            >
              {isSubmitting ? "Starting..." : "Start Job Now"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full h-12 mt-2 rounded-card bg-white dark:bg-gray-800 border text-[#374151] dark:text-gray-300"
              style={{ border: "1px solid #E2E8F0" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
