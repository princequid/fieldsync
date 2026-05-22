import { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, UserPlus, X } from "lucide-react";
import Modal from "../../../components/common/Modal";

const INPUT_CLS =
  "w-full h-10 rounded-input border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] outline-none transition-all duration-150 placeholder:text-[#94A3B8] focus:border-[#2E86AB] focus:bg-white focus:ring-[0_0_0_3px] focus:ring-[rgba(46,134,171,0.15)] dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-[#2E86AB] dark:focus:bg-gray-800";

const INPUT_ERR_CLS = `${INPUT_CLS} border-red-400 bg-red-50 focus:border-red-400 focus:ring-[rgba(239,68,68,0.15)] dark:border-red-500 dark:bg-red-950/25 dark:focus:border-red-500`;

export default function AddTechnicianModal({ onSuccess, onClose }) {
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  function validate() {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email";
    if (!formData.specialty.trim()) errs.specialty = "Specialty is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onSuccess(formData);
    setSuccess(true);
    setTimeout(animatedClose, 1800);
  }

  if (success) {
    return (
      <Modal onClose={animatedClose} maxWidth="max-w-md" closing={closing}>
        <div className="flex flex-col items-center px-8 py-12">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full bg-green-500/20 blur-xl dark:bg-green-400/15"
              aria-hidden
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 dark:shadow-green-900/40">
              <CheckCircle2
                size={32}
                className="text-white"
                strokeWidth={2.25}
                aria-hidden
              />
            </div>
          </div>
          <p
            className="mt-5 text-[18px] font-bold text-gray-900 dark:text-green-400"
            style={{ animation: "fade-in 200ms ease-out 300ms both" }}
          >
            Account created
          </p>
          <p
            className="mt-1.5 max-w-xs text-center text-[13px] leading-relaxed text-gray-500 dark:text-gray-400"
            style={{ animation: "fade-in 200ms ease-out 420ms both" }}
          >
            A welcome email with login instructions has been sent.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={animatedClose} maxWidth="max-w-md" closing={closing}>
      {/* Header */}
      <div className="fs-modal-header border-b border-[#F1F5F9] dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/15">
            <UserPlus size={18} strokeWidth={2.25} aria-hidden />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-50">
              Add Technician
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Invite a new field team member
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={animatedClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="fs-modal-body">
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/80 px-3.5 py-3 dark:border-blue-900/60 dark:bg-blue-950/30">
          <Mail
            size={15}
            className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400"
            aria-hidden
          />
          <p className="text-[12px] leading-relaxed text-blue-800/80 dark:text-blue-300/90">
            They&apos;ll receive a welcome email with a link to set their
            password and access assigned jobs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset className="space-y-4">
            <legend className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Personal details
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name" error={errors.firstName} required>
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
              <FormField label="Last name" error={errors.lastName} required>
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
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Contact &amp; role
            </legend>
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

            <FormField label="Phone" hint="Optional — for on-site contact">
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

            <FormField label="Role">
              <div className="flex h-10 items-center justify-between rounded-input border border-dashed border-gray-200 bg-gray-50/80 px-3 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">
                  Technician
                </span>
                <span className="rounded-md bg-gray-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  Fixed
                </span>
              </div>
            </FormField>
          </fieldset>

          <div className="fs-modal-footer-bar -mx-5 -mb-5 mt-1">
            <button
              type="button"
              onClick={animatedClose}
              className="fs-btn-secondary fs-btn-press fs-focus-ring flex h-9 items-center rounded-button px-4 text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="fs-btn-gradient-navy fs-btn-press fs-focus-ring flex h-9 items-center rounded-button px-5 text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50 dark:shadow-[0_2px_12px_rgba(30,58,95,0.45)]"
            >
              {loading ? "Creating…" : "Add Technician"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function FormField({ label, error, required = false, hint, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1">
        <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
        {required && (
          <span className="text-[10px] text-red-500" aria-hidden>
            *
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle size={12} aria-hidden />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
          {hint}
        </p>
      )}
    </label>
  );
}
