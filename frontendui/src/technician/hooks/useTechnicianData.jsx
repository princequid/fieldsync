import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getJobsByTechnician, getUserById } from "../../shared/utils/mockData";

const TechnicianDataContext = createContext(null);
const MOCK_FETCH_MS = 300;

export function TechnicianDataProvider({ technicianId, children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const techUser = getUserById(technicianId);
  const techName = techUser?.name ?? "Technician";

  const refetch = useCallback(async () => {
    if (!technicianId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    // TODO: replace with Apollo useQuery(GET_TECHNICIAN_JOBS) once backend is ready
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_MS));
      setJobs(getJobsByTechnician(technicianId));
    } catch (err) {
      setError(err?.message ?? "Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  }, [technicianId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function updateJobStatus(jobId, newStatus, note = null) {
    // TODO: replace with Apollo useMutation(UPDATE_JOB_STATUS) once backend is ready
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: newStatus,
              ...(newStatus === "COMPLETED" && note
                ? { completionNote: note }
                : {}),
              updatedAt: new Date().toISOString(),
              statusHistory: [
                {
                  status: newStatus,
                  changedByName: techName,
                  changedAt: new Date().toISOString(),
                  note,
                },
                ...(j.statusHistory ?? []),
              ],
            }
          : j,
      ),
    );
  }

  const value = useMemo(
    () => ({
      technicianId,
      jobs,
      loading,
      error,
      refetch,
      updateJobStatus,
    }),
    [technicianId, jobs, loading, error, refetch],
  );

  return (
    <TechnicianDataContext.Provider value={value}>
      {children}
    </TechnicianDataContext.Provider>
  );
}

export function useTechnicianData(technicianId) {
  const ctx = useContext(TechnicianDataContext);
  if (!ctx) {
    throw new Error(
      "useTechnicianData must be used within TechnicianDataProvider",
    );
  }
  if (technicianId && ctx.technicianId !== technicianId) {
    return { ...ctx, jobs: [], loading: false, error: null };
  }
  return ctx;
}
