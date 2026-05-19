import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MOCK_JOBS,
  MOCK_NOTIFICATIONS,
  getTechnicians,
} from "../../shared/utils/mockData";

const AdminDataContext = createContext(null);
const MOCK_FETCH_MS = 300;

export function AdminDataProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    // TODO: replace with Apollo useQuery(GET_ADMIN_DASHBOARD) once backend is ready
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_MS));
      setJobs([...MOCK_JOBS]);
      setTechnicians(getTechnicians());
      setNotifications([...MOCK_NOTIFICATIONS]);
    } catch (err) {
      setError(err?.message ?? "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function verifyJob(jobId) {
    // TODO: replace with Apollo useMutation(VERIFY_JOB) once backend is ready
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: "VERIFIED",
              updatedAt: new Date().toISOString(),
              statusHistory: [
                {
                  status: "VERIFIED",
                  changedByName: "Akosua Mensah",
                  changedAt: new Date().toISOString(),
                  note: null,
                },
                ...(j.statusHistory ?? []),
              ],
            }
          : j,
      ),
    );
  }

  function rejectJob(jobId) {
    // TODO: replace with Apollo useMutation(REJECT_JOB_COMPLETION) once backend is ready
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "IN_PROGRESS", updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  }

  function cancelJob(jobId) {
    // TODO: replace with Apollo useMutation(CANCEL_JOB) once backend is ready
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "CANCELLED", updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  }

  function reassignJob(jobId, newTechnicianId) {
    // TODO: replace with Apollo useMutation(REASSIGN_JOB) once backend is ready
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              technicianId: newTechnicianId,
              updatedAt: new Date().toISOString(),
            }
          : j,
      ),
    );
  }

  function createJob(jobData) {
    // TODO: replace with Apollo useMutation(CREATE_JOB) once backend is ready
    const newJob = {
      id: `job-${Date.now()}`,
      jobNumber: `#JOB-${String(jobs.length + 41).padStart(4, "0")}`,
      statusHistory: [
        {
          status: "PENDING",
          changedByName: "Akosua Mensah",
          changedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "PENDING",
      ...jobData,
    };
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  }

  function addTechnician({ firstName, lastName, email, phone }) {
    // TODO: replace with Apollo useMutation(CREATE_TECHNICIAN) once backend is ready
    const newTech = {
      id: `user-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      phone: phone ?? "",
      role: "TECHNICIAN",
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      isActive: true,
      activeJobs: 0,
      completedThisMonth: 0,
      avgDurationHours: null,
      online: false,
    };
    setTechnicians((prev) => [...prev, newTech]);
    return newTech;
  }

  function markNotificationRead(notificationId) {
    // TODO: replace with Apollo useMutation(MARK_NOTIFICATION_READ) once backend is ready
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
    );
  }

  const value = useMemo(
    () => ({
      jobs,
      technicians,
      notifications,
      loading,
      error,
      refetch,
      verifyJob,
      rejectJob,
      cancelJob,
      reassignJob,
      createJob,
      addTechnician,
      markNotificationRead,
    }),
    [jobs, technicians, notifications, loading, error, refetch],
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
