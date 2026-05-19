import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../components/common/Modal";
import { getJobById, getUserById, getTechnicians } from "../../../shared/utils/mockData";

export default function ReassignModal({ jobId, currentTechnicianId, onConfirm, onClose }) {
  const [closing,    setClosing]    = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason,     setReason]     = useState("");

  const job         = getJobById(jobId);
  const currentTech = getUserById(currentTechnicianId);
  const technicians = getTechnicians();

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  function handleConfirm() {
    if (!selectedId) return;
    onConfirm(selectedId);
    animatedClose();
  }

  return (
    <Modal onClose={animatedClose} maxWidth="max-w-lg" closing={closing}>
      {/* Header */}
      <div className="fs-modal-header">
        <div>
          <h2 className="text-[15px] font-semibold text-[#0F172A]">Reassign Job</h2>
          {job && <p className="mt-0.5 font-mono text-[10px] text-[#94A3B8]">{job.jobNumber}</p>}
        </div>
        <button
          onClick={animatedClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#374151]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="fs-modal-body space-y-4">
        {currentTech && (
          <div>
            <p className="fs-label mb-1.5 text-[#94A3B8]">Currently Assigned</p>
            <div className="inline-flex items-center gap-2 rounded-card border border-black/5 bg-gray-50 px-3 py-2">
              <div
                className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #2E86AB, #1A6FA8)" }}
              >
                {currentTech.initials}
              </div>
              <span className="text-[13px] font-medium text-[#0F172A]">{currentTech.name}</span>
              <span className="rounded-badge bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                {currentTech.activeJobs ?? 0} active
              </span>
            </div>
          </div>
        )}

        {/* Technician list */}
        <div>
          <p className="fs-label mb-1.5 text-[#94A3B8]">Select New Technician</p>
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-card border border-black/5 p-1.5">
            {technicians.map((tech) => {
              const isCurrent  = tech.id === currentTechnicianId;
              const isSelected = tech.id === selectedId;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => !isCurrent && setSelectedId(tech.id)}
                  disabled={isCurrent}
                  className={`flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "border-2 border-brand-accent bg-blue-50"
                      : isCurrent
                        ? "cursor-not-allowed border border-black/5 bg-gray-100 opacity-40"
                        : "border border-transparent hover:border-black/5 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #2E86AB, #1A6FA8)" }}
                  >
                    {tech.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#0F172A]">
                      {tech.name}
                      {isCurrent && <span className="ml-2 text-[11px] font-normal text-[#94A3B8]">(current)</span>}
                    </p>
                    <p className="truncate text-[11px] text-[#94A3B8]">{tech.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-[#94A3B8]">{tech.activeJobs ?? 0} active</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-badge px-2 py-0.5 text-[10px] font-medium ${
                        tech.online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${tech.online ? "bg-green-500" : "bg-gray-400"}`} />
                      {tech.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason */}
        <label className="block">
          <span className="fs-label mb-1.5 block text-[#94A3B8]">
            Reason <span className="normal-case text-gray-300">(optional)</span>
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Briefly explain why you are reassigning this job…"
            className="w-full resize-none rounded-input border border-black/8 bg-white px-3 py-2.5 text-[13px] text-[#0F172A] outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
          />
        </label>
      </div>

      {/* Footer */}
      <div className="fs-modal-footer-bar">
        <button
          type="button"
          onClick={animatedClose}
          className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button border border-black/8 bg-white px-4 text-[13px] font-medium text-[#374151] transition-colors hover:border-brand-accent hover:text-brand-accent"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedId}
          className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button px-4 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "linear-gradient(180deg, #1E3A5F 0%, #162D4A 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          Confirm Reassignment
        </button>
      </div>
    </Modal>
  );
}
