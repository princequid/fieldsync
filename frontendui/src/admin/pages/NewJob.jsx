import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import {
  getClients,
  getTechnicians,
  getUserById,
} from "../../shared/utils/mockData";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export default function NewJob() {
  const navigate = useNavigate();
  const { createJob, loading, error, refetch } = useAdminData();
  const technicians = getTechnicians();
  const clients = getClients();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    technicianId: "",
    location: "",
    priority: "MEDIUM",
    scheduledDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  function validate() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
    }

    if (!formData.technicianId) {
      newErrors.technicianId = "Technician is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        clientId: formData.clientId,
        technicianId: formData.technicianId,
        priority: formData.priority,
        ...(formData.scheduledDate
          ? { scheduledDate: formData.scheduledDate }
          : {}),
      };

      const newJob = createJob(jobData);
      const technicianName =
        getUserById(newJob.technicianId)?.name ?? "Unassigned";

      setSuccessData({
        jobId: newJob.id,
        jobNumber: newJob.jobNumber,
        technicianName,
      });
    } catch (error) {
      setErrors({ submit: "Failed to create job. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData({
      title: "",
      description: "",
      clientId: "",
      technicianId: "",
      location: "",
      priority: "MEDIUM",
      scheduledDate: "",
    });
    setErrors({});
    setSuccessData(null);
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (successData) {
    return (
      <div className="min-h-screen bg-[#f5f2ee] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-4xl bg-white p-8 shadow-[0_20px_60px_rgba(30,58,95,0.12)] text-center">
          <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
          <h1 className="text-2xl font-bold text-gray-900">Job Created!</h1>
          <p className="mt-3 text-gray-700">
            {successData.jobNumber} has been created and assigned to{" "}
            <span className="font-semibold">{successData.technicianName}</span>.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB]"
            >
              Create Another Job
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/jobs/${successData.jobId}`)}
              className="rounded-2xl bg-[#1E3A5F] px-6 py-3 text-sm font-medium text-white hover:bg-[#17304d]"
            >
              View Job →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="form data"
      onRetry={refetch}
      className="min-h-screen bg-[#f5f2ee]"
    >
    <div className="min-h-screen bg-[#f5f2ee] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-4xl bg-white p-8 shadow-[0_20px_60px_rgba(30,58,95,0.12)]">
        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create and assign a new job.
        </p>

        {errors.submit ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.submit}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormField label="Job Title" error={errors.title} required>
            <input
              type="text"
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Enter job title"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </FormField>

          <FormField label="Description" error={errors.description} required>
            <textarea
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Enter job description"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20 resize-none"
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Client" error={errors.clientId} required>
              <select
                value={formData.clientId}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientId: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
              >
                <option value="">Select client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Assigned Technician"
              error={errors.technicianId}
              required
            >
              <select
                value={formData.technicianId}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    technicianId: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
              >
                <option value="">Select technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.activeJobs ?? 0} active)
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            label="Site Location / Address"
            error={errors.location}
            required
          >
            <input
              type="text"
              value={formData.location}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              placeholder="Enter site location"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Priority">
              <select
                value={formData.priority}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Scheduled Date">
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB] order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasErrors}
              className="rounded-2xl bg-[#1E3A5F] px-4 py-3 text-sm font-medium text-white hover:bg-[#17304d] disabled:cursor-not-allowed disabled:opacity-50 order-1 sm:order-2 sm:ml-auto"
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AsyncPageContent>
  );
}

function FormField({ label, error, required = false, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {required ? <span className="text-red-500">*</span> : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
