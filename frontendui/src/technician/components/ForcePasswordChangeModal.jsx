import { useState } from "react";
import { AlertCircle, KeyRound } from "lucide-react";
import Modal from "../../components/common/Modal";
import FormTransition from "../../shared/components/FormTransition";
import { useAuth } from "../../shared/context/AuthContext";

const INPUT_CLS =
  "w-full h-10 rounded-input border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] outline-none transition-all duration-150 placeholder:text-[#94A3B8] focus:border-[#2E86AB] focus:bg-white focus:ring-[0_0_0_3px] focus:ring-[rgba(46,134,171,0.15)] dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-[#2E86AB] dark:focus:bg-gray-800";

const INPUT_ERR_CLS = `${INPUT_CLS} border-red-400 bg-red-50 focus:border-red-400 focus:ring-[rgba(239,68,68,0.15)] dark:border-red-500 dark:bg-red-950/25 dark:focus:border-red-500`;

const noop = () => {};

export default function ForcePasswordChangeModal() {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setFormData((p) => ({ ...p, [field]: value }));
  }

  function validate() {
    const errs = {};
    if (!formData.currentPassword)
      errs.currentPassword = "Enter your temporary password";
    if (!formData.newPassword) errs.newPassword = "Enter a new password";
    else if (formData.newPassword.length < 6)
      errs.newPassword = "Must be at least 6 characters";
    else if (formData.newPassword === formData.currentPassword)
      errs.newPassword = "Must be different from your temporary password";
    if (formData.confirmPassword !== formData.newPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={noop} maxWidth="max-w-sm">
      <div className="fs-modal-header border-b border-[#F1F5F9] dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/15">
            <KeyRound size={18} strokeWidth={2.25} aria-hidden />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-50">
              Set a new password
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Required before you can continue
            </p>
          </div>
        </div>
      </div>

      <div className="fs-modal-body">
        <p className="mb-5 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
          You&apos;re signing in with a temporary password. Choose a new
          password to secure your account.
        </p>

        <FormTransition submitting={loading}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Temporary password" error={errors.currentPassword}>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => update("currentPassword", e.target.value)}
                autoComplete="current-password"
                className={errors.currentPassword ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <FormField label="New password" error={errors.newPassword}>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => update("newPassword", e.target.value)}
                autoComplete="new-password"
                className={errors.newPassword ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            <FormField label="Confirm new password" error={errors.confirmPassword}>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                autoComplete="new-password"
                className={errors.confirmPassword ? INPUT_ERR_CLS : INPUT_CLS}
              />
            </FormField>

            {errors.submit && (
              <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle size={13} aria-hidden />
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="fs-btn-gradient-navy fs-focus-ring flex h-10 w-full items-center justify-center rounded-button text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </FormTransition>
      </div>
    </Modal>
  );
}

function FormField({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1">
        <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
        <span className="text-[10px] text-red-500" aria-hidden>
          *
        </span>
      </div>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle size={12} aria-hidden />
          {error}
        </p>
      )}
    </label>
  );
}
