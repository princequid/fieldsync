import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../components/common/Modal";
import { getJobById, getUserById, getTechnicians } from "../../../shared/utils/mockData";

export default function ReassignModal({
  jobId,
  currentTechnicianId,
  onConfirm,
  onClose,
}) {
  const job = getJobById(jobId);
  const currentTech = getUserById(currentTechnicianId);
  const technicians = getTechnicians();
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");

  function handleConfirm() {
    if (!selectedId) return;
    onConfirm(selectedId);
    onClose();
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-lg">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reassign Job</h2>
            {job && (
              <p className="mt-1 font-mono text-xs text-gray-400">
                {job.jobNumber}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current technician chip */}
        {currentTech && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Currently Assigned
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2E86AB] text-xs font-medium text-white">
                {currentTech.initials}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {currentTech.name}
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {currentTech.activeJobs ?? 0} active
              </span>
            </div>
          </div>
        )}

        {/* Scrollable technician list */}
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Select New Technician
          </p>
          <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-2xl border border-slate-200 p-2">
            {technicians.map((tech) => {
              const isCurrent = tech.id === currentTechnicianId;
              const isSelected = tech.id === selectedId;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => !isCurrent && setSelectedId(tech.id)}
                  disabled={isCurrent}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "border-2 border-[#2E86AB] bg-blue-50"
                      : isCurrent
                        ? "cursor-not-allowed border border-slate-100 bg-slate-100 opacity-50"
                        : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E86AB] text-sm font-medium text-white">
                    {tech.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {tech.name}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          (current)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-gray-500">{tech.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {tech.activeJobs ?? 0} active
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        tech.online
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${tech.online ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {tech.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason textarea */}
        <div className="mb-6">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Reason{" "}
              <span className="normal-case text-gray-400">(optional)</span>
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Briefly explain why you are reassigning this job..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#2E86AB] hover:text-[#2E86AB] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedId}
            className="flex-1 rounded-2xl bg-[#1E3A5F] px-4 py-3 text-sm font-medium text-white hover:bg-[#17304d] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Confirm Reassignment
          </button>
        </div>
      </div>
    </Modal>
  );
}
