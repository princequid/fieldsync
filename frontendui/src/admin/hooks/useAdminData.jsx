import { createContext, useCallback, useContext, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_JOBS,
  GET_NOTIFICATIONS,
  GET_USERS,
  CREATE_JOB,
  UPDATE_JOB_STATUS,
  CANCEL_JOB,
  REASSIGN_JOB,
  REJECT_JOB_COMPLETION,
  REGISTER_MUTATION,
  CREATE_TECHNICIAN_MUTATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
} from "../../graphql/operations";

const AdminDataContext = createContext(null);

// Derive initials from a full name string
function toInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Normalize a backend User object to include display-helper fields
function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    initials: toInitials(user.name),
    companyName: user.name,
    phone: user.phone ?? null,
    address: user.address ?? null,
    online: false,
    activeJobs: 0,
    completedThisMonth: 0,
    avgDurationHours: null,
    isActive: true,
  };
}

// Normalize a backend Job object to the shape components expect
function normalizeJob(job) {
  if (!job) return null;
  return {
    ...job,
    technicianId: job.technician?.id ?? null,
    clientId: job.client?.id ?? null,
    clientEmail: job.client?.email ?? null,
    clientPhone: job.client?.phone ?? null,
    clientAddress: job.client?.address ?? null,
    priority: job.priority ?? "MEDIUM",
    jobNumber: `#${job.id.slice(-6).toUpperCase()}`,
    completionNote: job.completionNote ?? null,
    statusHistory: [],
    technician: normalizeUser(job.technician),
    client: normalizeUser(job.client),
    createdBy: normalizeUser(job.createdBy),
  };
}

// Normalize a backend Notification
function normalizeNotification(n) {
  if (!n) return null;
  return {
    ...n,
    jobId: n.job?.id ?? null,
    type: "STATUS_CHANGED",
  };
}

export function AdminDataProvider({ children }) {
  const jobsQuery = useQuery(GET_JOBS, { fetchPolicy: "cache-and-network" });
  const techsQuery = useQuery(GET_USERS, {
    variables: { role: "TECHNICIAN" },
    fetchPolicy: "cache-and-network",
  });
  const clientsQuery = useQuery(GET_USERS, {
    variables: { role: "CLIENT" },
    fetchPolicy: "cache-and-network",
  });
  const notifsQuery = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: "cache-and-network",
  });

  const [createJobMutation] = useMutation(CREATE_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const [updateStatusMutation] = useMutation(UPDATE_JOB_STATUS, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const [cancelJobMutation] = useMutation(CANCEL_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const [reassignJobMutation] = useMutation(REASSIGN_JOB, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const [rejectJobMutation] = useMutation(REJECT_JOB_COMPLETION, {
    refetchQueries: [{ query: GET_JOBS }],
  });
  const [registerMutation] = useMutation(REGISTER_MUTATION, {
    refetchQueries: [
      { query: GET_USERS, variables: { role: "TECHNICIAN" } },
      { query: GET_USERS, variables: { role: "CLIENT" } },
    ],
  });
  const [createTechnicianMutation] = useMutation(CREATE_TECHNICIAN_MUTATION, {
    refetchQueries: [{ query: GET_USERS, variables: { role: "TECHNICIAN" } }],
  });
  const [markReadMutation] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });
  const [markAllReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
  });

  const loading =
    jobsQuery.loading ||
    techsQuery.loading ||
    clientsQuery.loading ||
    notifsQuery.loading;

  const error =
    jobsQuery.error?.message ||
    techsQuery.error?.message ||
    clientsQuery.error?.message ||
    notifsQuery.error?.message ||
    null;

  const jobs = useMemo(
    () => (jobsQuery.data?.jobs ?? []).map(normalizeJob),
    [jobsQuery.data],
  );

  const technicians = useMemo(
    () => (techsQuery.data?.users ?? []).map(normalizeUser),
    [techsQuery.data],
  );

  const clients = useMemo(
    () => (clientsQuery.data?.users ?? []).map(normalizeUser),
    [clientsQuery.data],
  );

  const notifications = useMemo(
    () => (notifsQuery.data?.notifications ?? []).map(normalizeNotification),
    [notifsQuery.data],
  );

  const refetch = useCallback(() => {
    jobsQuery.refetch();
    techsQuery.refetch();
    clientsQuery.refetch();
    notifsQuery.refetch();
  }, [jobsQuery, techsQuery, clientsQuery, notifsQuery]);

  async function verifyJob(jobId) {
    await updateStatusMutation({ variables: { jobId, status: "VERIFIED" } });
  }

  async function rejectJob(jobId) {
    await rejectJobMutation({ variables: { jobId } });
  }

  async function cancelJob(jobId) {
    await cancelJobMutation({ variables: { jobId } });
  }

  async function reassignJob(jobId, newTechnicianId) {
    await reassignJobMutation({ variables: { jobId, technicianId: newTechnicianId } });
  }

  async function createJob(jobData) {
    const { data } = await createJobMutation({
      variables: {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        technicianId: jobData.technicianId,
        clientId: jobData.clientId,
        priority: jobData.priority ?? "MEDIUM",
      },
    });
    return normalizeJob(data?.createJob);
  }

  async function createClient({ companyName, email, phone, address }) {
    const password = `Client@${Date.now()}`;
    const { data } = await registerMutation({
      variables: {
        name: companyName,
        email,
        password,
        role: "CLIENT",
        phone: phone?.trim() || null,
        address: address?.trim() || null,
      },
    });
    return normalizeUser(data?.register?.user);
  }

  async function addTechnician({ firstName, lastName, email, phone }) {
    const { data } = await createTechnicianMutation({
      variables: {
        name: `${firstName} ${lastName}`,
        email,
        phone: phone?.trim() || null,
      },
    });
    return {
      user: normalizeUser(data?.createTechnician?.user),
      temporaryPassword: data?.createTechnician?.temporaryPassword ?? null,
    };
  }

  async function markNotificationRead(notificationId) {
    await markReadMutation({ variables: { notificationId } });
  }

  async function markAllNotificationsRead() {
    await markAllReadMutation();
  }

  const value = useMemo(
    () => ({
      jobs,
      technicians,
      clients,
      notifications,
      loading,
      error,
      refetch,
      verifyJob,
      rejectJob,
      cancelJob,
      reassignJob,
      createJob,
      createClient,
      addTechnician,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, technicians, clients, notifications, loading, error, refetch],
  );

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}
