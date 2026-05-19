import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";
import { getUserById } from "../../shared/utils/mockData";
import Button from "../../shared/components/Button";

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
        <p className="font-semibold text-gray-900">Job not found</p>
        <Link to="/tech/jobs" className="mt-4 inline-block text-[#2E86AB]">
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
    <div className="space-y-6 p-4">
      <Link
        to={`/tech/jobs/${job.id}`}
        className="flex min-h-11 items-center gap-2 text-sm font-medium text-[#2E86AB]"
      >
        <ArrowLeft size={18} aria-hidden />
        Back
      </Link>

      <section className="fs-card p-5">
        <h1 className="text-xl font-bold text-gray-900">Start this job?</h1>
        <p className="mt-2 text-[13px] text-gray-600">
          Confirm you have arrived at the site and are ready to begin work on{" "}
          <span className="font-medium text-gray-900">{job.title}</span>.
        </p>
        {client ? (
          <p className="mt-2 text-[13px] text-gray-500">{client.name}</p>
        ) : null}
        <p className="mt-1 text-[13px] text-gray-500">{job.location}</p>
      </section>

      <Button
        fullWidth
        size="lg"
        variant="secondary"
        loading={isSubmitting}
        onClick={handleStart}
      >
        Confirm — Start Job
      </Button>
    </div>
  );
}
