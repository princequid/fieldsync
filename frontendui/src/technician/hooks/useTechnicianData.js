import { useState } from "react";
import { getJobsByTechnician, getUserById } from "../../shared/utils/mockData";

export function useTechnicianData(technicianId) {
  const [jobs, setJobs] = useState(() => getJobsByTechnician(technicianId));
  const loading = false;
  const error = null;

  const techUser = getUserById(technicianId);
  const techName = techUser?.name ?? "Technician";

  function updateJobStatus(jobId, newStatus, note = null) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: newStatus,
              ...(newStatus === "COMPLETED" && note ? { completionNote: note } : {}),
              updatedAt: new Date().toISOString(),
              statusHistory: [
                {
                  status: newStatus,
                  changedByName: techName,
                  changedAt: new Date().toISOString(),
                  note,
                },
                ...j.statusHistory,
              ],
            }
          : j,
      ),
    );
  }

  function addJob(jobData) {
    setJobs((prev) => [jobData, ...prev]);
  }

  return { jobs, loading, error, updateJobStatus, addJob };
}
