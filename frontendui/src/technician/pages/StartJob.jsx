import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useTechnicianData } from "../hooks/useTechnicianData";
import Button from "../../shared/components/Button";

const WILL_HAPPEN = [
  "The status will update to In Progress",
  "Your admin will be notified",
  "The job timer will start",
];

export default function StartJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useTechnicianData();
  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  if (!job) {
    navigate("/tech/jobs", { replace: true });
    return null;
  }

  function handleStart() {
    updateJobStatus(id, "IN_PROGRESS");
    navigate(`/tech/jobs/${id}`, { replace: true });
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(30,58,95,0.12)]">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Wrench size={32} className="text-[#2E86AB]" aria-hidden />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Start this job?
        </h1>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-gray-900">{job.title}</p>
          <p className="mt-1 text-sm text-gray-500">{job.location}</p>
        </div>

        <ul className="mt-5 space-y-2.5">
          {WILL_HAPPEN.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="font-bold text-[#27AE60]">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleStart}
            className="!min-h-[48px]"
          >
            Yes, Start Job Now
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={() => navigate(`/tech/jobs/${id}`)}
            className="!min-h-[48px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
