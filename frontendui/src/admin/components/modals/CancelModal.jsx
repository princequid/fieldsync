import { AlertTriangle, X } from "lucide-react";
import Modal from "../../../components/common/Modal";

export default function CancelModal({ jobId, jobTitle, onConfirm, onClose }) {
  function handleConfirm() {
    onConfirm(jobId);
    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="p-8">
        {/* Close button */}
        <div className="mb-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning icon + heading */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="text-red-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Cancel this job?</h2>
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone. The technician and client will be
            notified.
          </p>
        </div>

        {/* Job title confirmation box */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <p className="text-sm font-medium text-gray-700">{jobTitle}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB] transition-colors"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Yes, Cancel Job
          </button>
        </div>
      </div>
    </Modal>
  );
}
