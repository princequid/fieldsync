import { useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function StartJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useOutletContext();
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
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Wrench size={32} className="text-[#2E86AB]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Start this job?
        </h1>

        {/* Summary box */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-gray-900">{job.title}</p>
          <p className="mt-1 text-sm text-gray-500">{job.location}</p>
        </div>

        {/* What will happen */}
        <ul className="mt-5 space-y-2.5">
          {[
            "Update job status to In Progress",
            "Notify your admin",
            "Start the job timer",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="font-bold text-[#27AE60]">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleStart}
            className="w-full rounded-2xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ minHeight: "52px", backgroundColor: "#2E86AB" }}
          >
            Yes, Start Job Now
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tech/jobs/${id}`)}
            className="w-full rounded-2xl border border-slate-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:border-[#2E86AB] hover:text-[#2E86AB]"
            style={{ minHeight: "52px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
