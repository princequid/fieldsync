import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../components/common/Modal";

export default function CancelModal({ jobId, jobTitle, onConfirm, onClose }) {
  const [closing, setClosing] = useState(false);

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  function handleConfirm() {
    onConfirm(jobId);
    animatedClose();
  }

  return (
    <Modal onClose={animatedClose} maxWidth="max-w-md" closing={closing}>
      {/* Header */}
      <div className="fs-modal-header">
        <span />
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
        <div className="mb-5 text-center">
          <svg className="mx-auto mb-4" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Cancel this job?</h2>
          <p className="mt-2 text-[13px] text-[#64748B] dark:text-gray-400">
            This action cannot be undone. The technician and client will be notified.
          </p>
        </div>

        <div className="rounded-card border border-black/5 bg-gray-50 px-4 py-3 text-center dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <p className="text-[13px] font-medium text-[#374151] dark:text-gray-200">{jobTitle}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="fs-modal-footer-bar">
        <button
          type="button"
          onClick={animatedClose}
          className="fs-focus-ring flex h-9 items-center rounded-button border border-black/8 bg-white px-4 text-[13px] font-medium text-[#374151] transition-colors hover:border-brand-accent hover:text-brand-accent"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="fs-focus-ring flex h-9 items-center rounded-button px-4 text-[13px] font-medium text-white"
          style={{
            background: "#DC2626",
            boxShadow: "var(--shadow-1)",
          }}
        >
          Yes, Cancel Job
        </button>
      </div>
    </Modal>
  );
}
