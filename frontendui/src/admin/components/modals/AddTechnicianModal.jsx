import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import Modal from "../../../components/common/Modal";

export default function AddTechnicianModal({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email";
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
    setTimeout(onClose, 1800);
  }

  if (success) {
    return (
      <Modal onClose={onClose} maxWidth="max-w-md">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="text-green-600" size={28} />
          </div>
          <p className="text-lg font-bold text-gray-900">Account created.</p>
          <p className="mt-1 text-sm text-gray-500">Welcome email sent.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="p-8">
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add Technician</h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mb-6 text-gray-500">Add a new technician to your team</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" error={errors.firstName} required>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, firstName: e.target.value }))
                }
                placeholder="Kofi"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
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
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </FormField>

          <FormField label="Phone">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+233 XX XXX XXXX"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </FormField>

          <FormField label="Role">
            <div className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-400">
              Technician
            </div>
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-[#1E3A5F] px-4 py-3 text-sm font-medium text-white hover:bg-[#17304d] disabled:opacity-60 transition-colors"
            >
              {loading ? "Creating..." : "Add Technician"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function FormField({ label, error, required = false, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {required && <span className="text-xs text-red-500">*</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </label>
  );
}
