import { createContext, useCallback, useContext, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_JOBS, UPDATE_JOB_STATUS } from "../../graphql/operations";

const TechnicianDataContext = createContext(null);

function normalizeJob(job) {
  if (!job) return null;
  return {
    ...job,
    technicianId: job.technician?.id ?? null,
    clientId: job.client?.id ?? null,
    clientEmail: job.client?.email ?? null,
    priority: job.priority ?? "MEDIUM",
    jobNumber: `#${job.id.slice(-6).toUpperCase()}`,
    completionNote: job.completionNote ?? null,
    statusHistory: [],
  };
}

export function TechnicianDataProvider({ technicianId, children }) {
  const { data, loading, error, refetch: apolloRefetch } = useQuery(GET_JOBS, {
    fetchPolicy: "cache-and-network",
    skip: !technicianId,
  });

  const [updateStatusMutation] = useMutation(UPDATE_JOB_STATUS, {
    refetchQueries: [{ query: GET_JOBS }],
  });

  const jobs = useMemo(
    () => (data?.jobs ?? []).map(normalizeJob),
    [data],
  );

  const refetch = useCallback(() => {
    if (technicianId) apolloRefetch();
  }, [technicianId, apolloRefetch]);

  async function updateJobStatus(jobId, newStatus) {
    await updateStatusMutation({ variables: { jobId, status: newStatus } });
  }

  const value = useMemo(
    () => ({
      technicianId,
      jobs,
      loading,
      error: error?.message ?? null,
      refetch,
      updateJobStatus,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    throw new Error("useTechnicianData must be used within TechnicianDataProvider");
  }
  if (technicianId && ctx.technicianId !== technicianId) {
    return { ...ctx, jobs: [], loading: false, error: null };
  }
  return ctx;
}
