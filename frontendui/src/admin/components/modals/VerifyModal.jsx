import { useState } from "react";
import { Camera, X } from "lucide-react";
import Modal from "../../../components/common/Modal";
import { getUserById } from "../../../shared/utils/mockData";

export default function VerifyModal({ job, onConfirm, onReject, onClose }) {
  const [adminNotes, setAdminNotes] = useState("");
  const technician = getUserById(job.technicianId);

  const completionEntry = job.statusHistory?.find(
    (entry) => entry.status === "COMPLETED",
  );
  const completedAt = completionEntry
    ? formatDateTime(completionEntry.changedAt)
    : null;

  function handleVerify() {
    onConfirm();
    onClose();
  }

  function handleReject() {
    onReject();
    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Job Completion
            </h2>
            <p className="mt-1 font-mono text-xs text-gray-400">
              {job.jobNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Green confirmation banner */}
        <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-800">
            {technician?.name ?? "Technician"} marked this job Completed
            {completedAt && (
              <span className="font-normal text-green-700"> · {completedAt}</span>
            )}
          </p>
        </div>

        {/* Completion note */}
        {job.completionNote && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Technician's Note
            </p>
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-700">
              {job.completionNote}
            </p>
          </div>
        )}

        {/* Completion photo placeholder */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Completion Photo
          </p>
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <div className="text-center">
              <Camera className="mx-auto text-slate-300" size={32} />
              <p className="mt-2 text-xs text-slate-400">No photo uploaded</p>
            </div>
          </div>
        </div>

        {/* Admin notes */}
        <div className="mb-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Admin Notes{" "}
              <span className="normal-case text-gray-400">(optional)</span>
            </span>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes before closing..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </label>
        </div>

        {/* Notification note */}
        <p className="mb-5 text-center text-xs text-gray-400">
          Client will be notified when you verify.
        </p>

        {/* Actions */}
        <div className="fs-modal-footer -mx-8 -mb-8 mt-2 flex gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="fs-btn-press fs-focus-ring flex-1 rounded-2xl border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="fs-btn-gradient-verify fs-btn-press fs-focus-ring flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-white"
          >
            Verify &amp; Close Job
          </button>
        </div>
      </div>
    </Modal>
  );
}

function formatDateTime(value) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} · ${time}`;
}
