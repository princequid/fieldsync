import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";

export default function StartJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, updateJobStatus } = useTechnicianData(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);
  const client = job ? getUserById(job.clientId) : null;

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
    <div className="space-y-5 p-4">
      <Link
        to={`/tech/jobs/${job.id}`}
        className="fs-focus-ring flex h-11 items-center gap-2 text-[13px] font-medium text-brand-accent"
      >
        <ArrowLeft size={16} aria-hidden />
        Back
      </Link>

      <section className="fs-card p-5">
        <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">Start this job?</h1>
        <p className="mt-2 text-[13px] text-gray-600 dark:text-gray-400">
          Confirm you have arrived at the site and are ready to begin work on{" "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</span>.
        </p>
        {client && (
          <p className="mt-1.5 text-[12px] text-gray-400 dark:text-gray-500">{client.name}</p>
        )}
        <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">{job.location}</p>
      </section>

      <button
        type="button"
        onClick={handleStart}
        disabled={isSubmitting}
        className="fs-btn-press fs-focus-ring relative flex h-14 w-full items-center justify-center overflow-hidden rounded-[12px] bg-linear-to-b from-[#2E86AB] to-[#1A6FA8] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[40%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15), transparent)",
          }}
        />
        {isSubmitting ? "Starting..." : "Confirm Start Job"}
      </button>
    </div>
  );
}
