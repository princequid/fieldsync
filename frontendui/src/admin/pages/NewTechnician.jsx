import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Copy, Info } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import FormTransition from "../../shared/components/FormTransition";

const INPUT_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white text-gray-900 outline-none transition placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500";
const INPUT_ERR_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-red-400 bg-white text-gray-900 outline-none transition placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  specialty: "",
};

export default function NewTechnician() {
  const navigate = useNavigate();
  const { addTechnician } = useAdminData();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  function validate() {
    const next = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      next.email = "Enter a valid email";
    if (!formData.specialty.trim()) next.specialty = "Specialty is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await addTechnician(formData);
      setSuccessData({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        temporaryPassword: result?.temporaryPassword ?? null,
      });
    } catch (err) {
      setErrors({ submit: err.message || "Failed to create technician account" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSuccessData(null);
    setCopied(false);
  }

  async function copyPassword() {
    if (!successData?.temporaryPassword) return;
    await navigator.clipboard.writeText(successData.temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (successData) {
    return (
      <div className="fs-admin-page-bg min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="fs-card mx-auto max-w-lg border border-transparent p-8 text-center dark:border-gray-800/80 dark:bg-gray-900/95">
          <CheckCircle2 className="mx-auto mb-4 text-green-600" size={36} aria-hidden />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">Account Created</h1>
          <p className="mt-2 text-[13px] text-gray-600 dark:text-gray-400">
            Share these credentials with{" "}
            <span className="font-medium text-gray-900 dark:text-gray-300">
              {successData.name}
            </span>{" "}
            so they can sign in. They&apos;ll be asked to set a new password on
            first login.
          </p>

          {successData.temporaryPassword && (
            <div className="mt-5 mx-auto w-full max-w-xs rounded-card border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-left dark:border-gray-700 dark:bg-gray-800/70">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  Email
                </span>
                <span className="truncate text-[12px] text-gray-700 dark:text-gray-200">
                  {successData.email}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-2 dark:border-gray-700">
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  Temporary password
                </span>
                <div className="flex items-center gap-1.5">
                  <code className="rounded-md bg-white px-2 py-0.5 text-[12px] font-semibold tracking-wide text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                    {successData.temporaryPassword}
                  </code>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-200/70 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    aria-label="Copy password"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
              {copied && (
                <p className="mt-1.5 text-right text-[11px] text-green-600 dark:text-green-400">
                  Copied to clipboard
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="fs-btn-secondary fs-focus-ring rounded-button px-6 py-2.5 text-[13px]"
            >
              Add Another Technician
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/team")}
              className="fs-btn-gradient-navy fs-focus-ring rounded-button px-6 py-2.5 text-[13px] font-medium text-white"
            >
              View Team →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fs-admin-page-bg min-h-screen p-6 pb-28">
      <div className="fs-card mx-auto max-w-2xl border border-transparent p-8 dark:border-gray-800/80 dark:bg-gray-900/95">
        <h1 className="fs-page-title dark:text-gray-50">Add Technician</h1>
        <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
          Invite a new field team member. A secure temporary password is
          generated automatically for them.
        </p>

        {errors.submit && (
          <div className="mt-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {errors.submit}
          </div>
        )}

        <FormTransition submitting={isSubmitting}>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="First Name" error={errors.firstName} required>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, firstName: e.target.value }))
                  }
                  placeholder="Kofi"
                  className={errors.firstName ? INPUT_ERR_CLS : INPUT_CLS}
                />
              </FormField>
              <FormField label="Last Name" error={errors.lastName} required>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, lastName: e.target.value }))
                  }
                  placeholder="Mensah"
                  className={errors.lastName ? INPUT_ERR_CLS : INPUT_CLS}
                />
              </FormField>
            </div>

            <FormField label="Email" error={errors.email} required>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="kofi@company.com"
                className={errors.email ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Phone">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+233 XX XXX XXXX"
                  className={INPUT_CLS}
                />
              </FormField>

              <FormField label="Specialty" error={errors.specialty} required>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, specialty: e.target.value }))
                  }
                  placeholder="e.g. HVAC, Electrical, Plumbing"
                  className={errors.specialty ? INPUT_ERR_CLS : INPUT_CLS}
                />
              </FormField>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-gray-500 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
              <Info
                size={13}
                className="shrink-0 text-blue-500 dark:text-blue-400"
                aria-hidden
              />
              <span>
                You&apos;ll need to share the generated temporary password with
                them so they can sign in and access assigned jobs.
              </span>
            </div>

            <div className="fs-form-sticky-footer flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/team")}
                className="fs-btn-secondary fs-focus-ring order-2 rounded-button px-5 py-2.5 text-[13px] sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasErrors}
                className="fs-btn-gradient-navy fs-focus-ring order-1 rounded-button px-6 py-2.5 text-[13px] font-medium text-white shadow-sm disabled:pointer-events-none disabled:opacity-50 sm:order-2"
              >
                {isSubmitting ? "Creating…" : "Add Technician"}
              </button>
            </div>
          </form>
        </FormTransition>
      </div>
    </div>
  );
}

function FormField({ label, error, required = false, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="fs-label text-gray-400 dark:text-gray-400">{label}</span>
        {required && (
          <span className="text-red-500" aria-hidden>
            *
          </span>
        )}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </label>
  );
}
