import { useState } from "react";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormGroup,
  FormSectionHeading,
  FormFooter,
} from "@/shared/components/forms";
import { StatusBadge, PriorityBadge } from "@/shared/components/badge";

/**
 * EXAMPLE: New Job Form
 * Demonstrates complete usage of the new form and badge system
 * with all styling specifications implemented
 */
export default function ExampleNewJobForm() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    priority: "",
    location: "",
    assignedTo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority level is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show preview instead of submitting for this example
      setPreview({
        ...formData,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });

      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      Object.values(formData).some((val) => val !== "") &&
      !window.confirm("Discard unsaved changes?")
    ) {
      return;
    }
    setFormData({
      jobTitle: "",
      description: "",
      priority: "",
      location: "",
      assignedTo: "",
    });
    setErrors({});
    setPreview(null);
  };

  if (preview) {
    return (
      <div className="min-h-screen bg-[#F0EDE8] p-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">
            Job Created Successfully
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#94A3B8]">Job Title</p>
              <p className="font-medium text-[#0F172A]">{preview.jobTitle}</p>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8]">Description</p>
              <p className="text-[#0F172A]">{preview.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#94A3B8]">Priority</p>
                <div className="mt-1">
                  <PriorityBadge priority={preview.priority} />
                </div>
              </div>

              <div>
                <p className="text-sm text-[#94A3B8]">Status</p>
                <div className="mt-1">
                  <StatusBadge status={preview.status} showDot={true} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8]">Location</p>
              <p className="font-medium text-[#0F172A]">{preview.location}</p>
            </div>

            <button
              onClick={() => setPreview(null)}
              className="mt-6 rounded-lg bg-[#2E86AB] px-4 py-2 font-medium text-white hover:bg-[#1d6f94]"
            >
              Create Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE8] p-6 pb-[100px]">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">
          Create New Job
        </h1>
        <p className="mb-8 text-[#94A3B8]">
          Fill in the details below to create a new job assignment
        </p>

        {/* Basic Information Section */}
        <FormSectionHeading>Basic Information</FormSectionHeading>
        <FormGroup>
          <FormInput
            name="jobTitle"
            id="job-title"
            label="Job Title"
            placeholder="e.g., Electrical Installation"
            value={formData.jobTitle}
            onChange={handleInputChange}
            error={errors.jobTitle}
            helperText="Give this job a clear, descriptive title"
            required
          />

          <FormSelect
            name="priority"
            id="priority"
            label="Priority Level"
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
            ]}
            value={formData.priority}
            onChange={handleInputChange}
            error={errors.priority}
            helperText="How urgent is this job?"
            required
          />
        </FormGroup>

        {/* Location & Assignment Section */}
        <FormSectionHeading>Location & Assignment</FormSectionHeading>
        <FormGroup>
          <FormInput
            name="location"
            id="location"
            label="Job Location"
            placeholder="e.g., 123 Main Street, Building A"
            value={formData.location}
            onChange={handleInputChange}
            error={errors.location}
            helperText="Full address or location description"
            required
          />

          <FormSelect
            name="assignedTo"
            id="assigned-to"
            label="Assign To Technician"
            options={[
              { value: "tech-001", label: "Kwame (Technician)" },
              { value: "tech-002", label: "Ama (Technician)" },
              { value: "tech-003", label: "Kofi (Technician)" },
            ]}
            value={formData.assignedTo}
            onChange={handleInputChange}
            helperText="Leave empty to assign later"
          />
        </FormGroup>

        {/* Description Section */}
        <FormSectionHeading>Job Details</FormSectionHeading>
        <FormGroup>
          <FormTextarea
            name="description"
            id="description"
            label="Job Description"
            placeholder="Provide detailed information about the work to be done..."
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            helperText="Be specific about what needs to be accomplished"
            maxLength={1000}
            rows={5}
            required
          />
        </FormGroup>

        {/* Preview Section */}
        {Object.values(formData).some((val) => val !== "") && (
          <div className="mt-8 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">
              Preview
            </h3>
            <div className="space-y-2 text-sm">
              {formData.jobTitle && (
                <p>
                  <span className="text-[#94A3B8]">Title:</span>{" "}
                  <span className="text-[#0F172A]">{formData.jobTitle}</span>
                </p>
              )}
              {formData.priority && (
                <p className="flex items-center gap-2">
                  <span className="text-[#94A3B8]">Priority:</span>
                  <PriorityBadge priority={formData.priority} />
                </p>
              )}
              {formData.location && (
                <p>
                  <span className="text-[#94A3B8]">Location:</span>{" "}
                  <span className="text-[#0F172A]">{formData.location}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <FormFooter
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        cancelText="Discard"
        submitText="Create Job"
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

/**
 * EXAMPLE: Job Card with Status and Priority Badges
 * Simple example showing badge usage
 */
export function ExampleJobCard() {
  const job = {
    id: 1,
    title: "Fix HVAC System",
    status: "IN_PROGRESS",
    priority: "HIGH",
    location: "Building B, Floor 3",
    technician: "Kwame",
  };

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-[#0F172A]">{job.title}</h3>
        <StatusBadge status={job.status} showDot={true} />
      </div>

      <p className="mb-3 text-sm text-[#94A3B8]">{job.location}</p>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#94A3B8]">Assigned to: {job.technician}</p>
        <PriorityBadge priority={job.priority} />
      </div>
    </div>
  );
}

/**
 * EXAMPLE: All Badge States
 * Reference showing all available badge states
 */
export function ExampleAllBadgeStates() {
  const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"];
  const priorities = ["LOW", "MEDIUM", "HIGH"];

  return (
    <div className="space-y-8 rounded-lg bg-white p-8">
      <div>
        <h2 className="mb-4 font-semibold text-[#0F172A]">Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <div key={status} className="flex flex-col items-center gap-2">
              <StatusBadge status={status} showDot={true} />
              <p className="text-xs text-[#94A3B8]">{status}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-[#0F172A]">Priority Badges</h2>
        <div className="flex flex-wrap gap-3">
          {priorities.map((priority) => (
            <div key={priority} className="flex flex-col items-center gap-2">
              <PriorityBadge priority={priority} />
              <p className="text-xs text-[#94A3B8]">{priority}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
