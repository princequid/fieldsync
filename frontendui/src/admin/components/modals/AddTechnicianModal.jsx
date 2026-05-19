import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../components/common/Modal";

export default function AddTechnicianModal({ onSuccess, onClose }) {
  const [closing,  setClosing]  = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  function validate() {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim())  errs.lastName  = "Last name is required";
    if (!formData.email.trim())     errs.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email";
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

  const INPUT_CLS =
    "w-full h-10 rounded-input border border-black/8 bg-white px-3 text-[13px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15";

  if (success) {
    return (
      <Modal onClose={animatedClose} maxWidth="max-w-md" closing={closing}>
        <div className="flex flex-col items-center px-8 py-10">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "#22C55E" }}
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden>
              <path
                d="M5 14l6 6L23 8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 26,
                  strokeDashoffset: 26,
                  animation: "check-draw 400ms cubic-bezier(0.4, 0, 0.2, 1) 60ms forwards",
                }}
              />
            </svg>
          </div>
          <p
            className="mt-4 text-[17px] font-bold text-[#0F172A]"
            style={{ animation: "fade-in 200ms ease-out 300ms both" }}
          >
            Account created.
          </p>
          <p
            className="mt-1 text-[13px] text-[#94A3B8]"
            style={{ animation: "fade-in 200ms ease-out 420ms both" }}
          >
            Welcome email sent.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={animatedClose} maxWidth="max-w-md" closing={closing}>
      {/* Header */}
      <div className="fs-modal-header">
        <h2 className="text-[15px] font-semibold text-[#0F172A]">Add Technician</h2>
        <button
          onClick={animatedClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#374151]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="fs-modal-body">
        <p className="mb-5 text-[13px] text-[#64748B]">Add a new technician to your team.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" error={errors.firstName} required>
              <input type="text" value={formData.firstName}
                onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="Kofi" className={INPUT_CLS} />
            </FormField>
            <FormField label="Last Name" error={errors.lastName} required>
              <input type="text" value={formData.lastName}
                onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="Mensah" className={INPUT_CLS} />
            </FormField>
          </div>

          <FormField label="Email" error={errors.email} required>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="kofi@company.com" className={INPUT_CLS} />
          </FormField>

          <FormField label="Phone">
            <input type="tel" value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+233 XX XXX XXXX" className={INPUT_CLS} />
          </FormField>

          <FormField label="Role">
            <div className="flex h-10 items-center rounded-input border border-black/5 bg-gray-50 px-3 text-[13px] text-[#94A3B8]">
              Technician
            </div>
          </FormField>

          {/* Footer inside form */}
          <div className="fs-modal-footer-bar -mx-5 -mb-5 mt-2">
            <button
              type="button"
              onClick={animatedClose}
              className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button border border-black/8 bg-white px-4 text-[13px] font-medium text-[#374151] transition-colors hover:border-brand-accent hover:text-brand-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button px-4 text-[13px] font-medium text-white disabled:opacity-60"
              style={{
                background: "linear-gradient(180deg, #1E3A5F 0%, #162D4A 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {loading ? "Creating…" : "Add Technician"}
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
      <div className="mb-1.5 flex items-center gap-1">
        <span className="fs-label text-[#94A3B8]">{label}</span>
        {required && <span className="text-[10px] text-red-500">*</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </label>
  );
}
