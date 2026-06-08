import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Info } from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import FormTransition from "../../shared/components/FormTransition";

const INPUT_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white text-gray-900 outline-none transition placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500";
const INPUT_ERR_CLS =
  "fs-input fs-focus-ring w-full rounded-input border border-red-400 bg-white text-gray-900 outline-none transition placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500";

const INITIAL_FORM = {
  companyName: "",
  email: "",
  phone: "",
  address: "",
};

export default function NewClient() {
  const navigate = useNavigate();
  const { createClient } = useAdminData();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  function validate() {
    const next = {};
    if (!formData.companyName.trim())
      next.companyName = "Company name is required";
    if (!formData.email.trim()) next.email = "Email address is required";
    else if (!formData.email.includes("@"))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const client = await createClient({
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
      setSuccessData({ companyName: client?.companyName ?? formData.companyName });
    } catch (err) {
      setErrors({ submit: err.message || "Failed to add client. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSuccessData(null);
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (successData) {
    return (
      <div className="fs-admin-page-bg min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="fs-card mx-auto max-w-lg border border-transparent p-8 text-center dark:border-gray-800/80 dark:bg-gray-900/95">
          <CheckCircle2 className="mx-auto mb-4 text-green-600" size={36} aria-hidden />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">Client Added</h1>
          <p className="mt-2 text-[13px] text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-300">
              {successData.companyName}
            </span>{" "}
            has been added. You can now assign jobs to this client.
          </p>
          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="fs-btn-secondary fs-focus-ring rounded-button px-6 py-2.5 text-[13px]"
            >
              Add Another Client
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/clients")}
              className="fs-btn-gradient-navy fs-focus-ring rounded-button px-6 py-2.5 text-[13px] font-medium text-white"
            >
              View Clients →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fs-admin-page-bg min-h-screen p-6 pb-28">
      <div className="fs-card mx-auto max-w-2xl border border-transparent p-8 dark:border-gray-800/80 dark:bg-gray-900/95">
        <h1 className="fs-page-title dark:text-gray-50">Add New Client</h1>
        <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
          Fill in the details below to add a new client to your records.
        </p>

        {errors.submit && (
          <div className="mt-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {errors.submit}
          </div>
        )}

        <FormTransition submitting={isSubmitting}>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <FormField label="Company Name" error={errors.companyName} required>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, companyName: e.target.value }))
                }
                placeholder="e.g. Accra Business Centre"
                className={errors.companyName ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <FormField label="Email Address" error={errors.email} required>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="e.g. facilities@company.com"
                className={errors.email ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Phone Number">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="e.g. +233 24 000 0000"
                  className={INPUT_CLS}
                />
              </FormField>

              <FormField label="Site Address">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="e.g. 14 Independence Ave, Accra"
                  className={INPUT_CLS}
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
                Phone and address are optional but help auto-fill job details
                when you assign work to this client.
              </span>
            </div>

            <div className="fs-form-sticky-footer flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/clients")}
                className="fs-btn-secondary fs-focus-ring order-2 rounded-button px-5 py-2.5 text-[13px] sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || hasErrors}
                className="fs-btn-gradient-navy fs-focus-ring order-1 rounded-button px-6 py-2.5 text-[13px] font-medium text-white shadow-sm disabled:pointer-events-none disabled:opacity-50 sm:order-2"
              >
                {isSubmitting ? "Adding…" : "Add Client"}
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
