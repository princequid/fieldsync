import { useState } from "react";
import {
  MOCK_JOBS,
  MOCK_NOTIFICATIONS,
  getTechnicians,
} from "../../shared/utils/mockData";

export function useAdminData() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [technicians, setTechnicians] = useState(() => getTechnicians());
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const loading = false;
  const error = null;

  function verifyJob(jobId) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "VERIFIED", updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  }

  function rejectJob(jobId) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "IN_PROGRESS", updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  }

  function cancelJob(jobId) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "CANCELLED", updatedAt: new Date().toISOString() }
          : j,
      ),
    );
  }

  function reassignJob(jobId, newTechnicianId) {
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
    const newJob = {
      id: `job-${Date.now()}`,
      jobNumber: `#JOB-${String(jobs.length + 1).padStart(4, "0")}`,
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

  return {
    jobs,
    technicians,
    notifications,
    loading,
    error,
    verifyJob,
    rejectJob,
    cancelJob,
    reassignJob,
    createJob,
    addTechnician,
  };
}
