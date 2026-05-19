import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import { getClients, getTechnicians, getUserById } from "../../shared/utils/mockData";

const PRIORITY_OPTIONS = [
  { value: "LOW",    label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH",   label: "High" },
];

const INPUT_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white text-gray-900 outline-none transition placeholder:text-gray-400";
const INPUT_ERR_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-red-400 bg-white text-gray-900 outline-none transition placeholder:text-gray-400";

export default function NewJob() {
  const navigate = useNavigate();
  const { createJob, loading, error, refetch } = useAdminData();
  const technicians = getTechnicians();
  const clients     = getClients();

  const [formData, setFormData] = useState({
    title: "", description: "", clientId: "", technicianId: "",
    location: "", priority: "MEDIUM", scheduledDate: "",
  });
  const [errors,      setErrors]      = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData,  setSuccessData]  = useState(null);

  function validate() {
    const next = {};
    if (!formData.title.trim())       next.title       = "Job title is required";
    if (!formData.description.trim()) next.description = "Description is required";
    if (!formData.clientId)           next.clientId    = "Client is required";
    if (!formData.technicianId)       next.technicianId = "Technician is required";
    if (!formData.location.trim())    next.location    = "Location is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const jobData = {
        title: formData.title, description: formData.description,
        location: formData.location, clientId: formData.clientId,
        technicianId: formData.technicianId, priority: formData.priority,
        ...(formData.scheduledDate ? { scheduledDate: formData.scheduledDate } : {}),
      };
      const newJob        = createJob(jobData);
      const technicianName = getUserById(newJob.technicianId)?.name ?? "Unassigned";
      setSuccessData({ jobId: newJob.id, jobNumber: newJob.jobNumber, technicianName });
    } catch {
      setErrors({ submit: "Failed to create job. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData({ title: "", description: "", clientId: "", technicianId: "",
      location: "", priority: "MEDIUM", scheduledDate: "" });
    setErrors({});
    setSuccessData(null);
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (successData) {
    return (
      <div className="min-h-screen bg-brand-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg fs-card p-8 text-center shadow-3">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="text-green-500" size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Job Created</h1>
          <p className="mt-2 text-[13px] text-gray-600">
            <span className="font-medium text-gray-900">{successData.jobNumber}</span> has been
            assigned to{" "}
            <span className="font-medium text-gray-900">{successData.technicianName}</span>.
          </p>
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="fs-btn-press fs-focus-ring rounded-button border border-black/8 bg-white px-6 py-2.5 text-[13px] font-medium text-gray-700 hover:border-brand-accent hover:text-brand-accent"
            >
              Create Another
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/jobs/${successData.jobId}`)}
              className="fs-btn-gradient-navy fs-btn-press fs-focus-ring rounded-button px-6 py-2.5 text-[13px] font-medium text-white"
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
      className="min-h-screen bg-brand-bg"
    >
      <div className="min-h-screen bg-brand-bg p-6 pb-28">
        <div className="mx-auto max-w-2xl fs-card p-8">
          <h1 className="fs-page-title">Create New Job</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Fill in the details below to create and assign a new job.
          </p>

          {errors.submit && (
            <div className="mt-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <FormField label="Job Title" error={errors.title} required>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Enter job title"
                className={errors.title ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <FormField label="Description" error={errors.description} required>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Enter job description"
                rows={4}
                className="fs-focus-ring w-full resize-none rounded-input border border-black/8 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Client" error={errors.clientId} required>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData((p) => ({ ...p, clientId: e.target.value }))}
                  className={errors.clientId ? INPUT_ERR_CLS : INPUT_CLS}
                >
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Assigned Technician" error={errors.technicianId} required>
                <select
                  value={formData.technicianId}
                  onChange={(e) => setFormData((p) => ({ ...p, technicianId: e.target.value }))}
                  className={errors.technicianId ? INPUT_ERR_CLS : INPUT_CLS}
                >
                  <option value="">Select technician…</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.activeJobs ?? 0} active)
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Site Location / Address" error={errors.location} required>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="Enter site location"
                className={errors.location ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Priority">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                  className={INPUT_CLS}
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Scheduled Date">
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData((p) => ({ ...p, scheduledDate: e.target.value }))}
                  className={INPUT_CLS}
                />
              </FormField>
            </div>

            <div className="fs-form-sticky-footer flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/jobs")}
                className="fs-btn-press fs-focus-ring order-2 rounded-button border border-black/8 bg-white px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:border-brand-accent hover:text-brand-accent sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasErrors}
                className="fs-btn-gradient-navy fs-btn-press fs-focus-ring order-1 rounded-button px-6 py-2.5 text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50 sm:order-2"
              >
                {isSubmitting ? "Creating…" : "Create Job"}
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
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="fs-label text-gray-400">{label}</span>
        {required && <span className="text-red-500" aria-hidden>*</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </label>
  );
}
