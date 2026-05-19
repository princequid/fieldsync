import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../components/common/Modal";
import { getUserById } from "../../../shared/utils/mockData";

export default function VerifyModal({ job, onConfirm, onReject, onClose }) {
  const [adminNotes, setAdminNotes] = useState("");
  const [verified,   setVerified]   = useState(false);
  const [closing,    setClosing]    = useState(false);

  const technician     = getUserById(job.technicianId);
  const completionEntry = job.statusHistory?.find((e) => e.status === "COMPLETED");
  const completedAt    = completionEntry ? formatDateTime(completionEntry.changedAt) : null;

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  function handleVerify() {
    onConfirm();
    setVerified(true);
  }

  function handleReject() {
    onReject();
    animatedClose();
  }

  /* Auto-close 2 s after success animation starts */
  useEffect(() => {
    if (!verified) return;
    const t = setTimeout(animatedClose, 2000);
    return () => clearTimeout(t);
  }, [verified]);

  return (
    <Modal onClose={animatedClose} maxWidth="max-w-lg" closing={closing}>
      {verified ? (
        /* ── Success state ─────────────────────────────────────── */
        <div className="flex flex-col items-center px-8 py-12">
          {/* 64px green circle + animated SVG checkmark */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "#22C55E" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
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

          {/* "Job Verified" fades in 200ms after checkmark starts */}
          <p
            className="mt-5 text-[20px] font-bold text-[#0F172A]"
            style={{ animation: "fade-in 200ms ease-out 300ms both" }}
          >
            Job Verified
          </p>
          <p
            className="mt-1 text-[13px] text-[#94A3B8]"
            style={{ animation: "fade-in 200ms ease-out 420ms both" }}
          >
            Closing automatically…
          </p>
        </div>
      ) : (
        /* ── Default content ───────────────────────────────────── */
        <>
          {/* Header */}
          <div className="fs-modal-header">
            <div>
              <h2 className="text-[15px] font-semibold text-[#0F172A]">Verify Job Completion</h2>
              <p className="mt-0.5 font-mono text-[10px] text-[#94A3B8]">{job.jobNumber}</p>
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
            {/* Completion banner */}
            <div className="rounded-card border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-[13px] font-medium text-green-800">
                {technician?.name ?? "Technician"} marked this job Completed
                {completedAt && (
                  <span className="font-normal text-green-700"> · {completedAt}</span>
                )}
              </p>
            </div>

            {/* Technician's note */}
            {job.completionNote && (
              <div>
                <p className="fs-label mb-1.5 text-[#94A3B8]">Technician's Note</p>
                <p className="rounded-card border border-black/5 bg-gray-50 px-4 py-3 text-[13px] text-[#374151]">
                  {job.completionNote}
                </p>
              </div>
            )}

            {/* Photo placeholder */}
            <div>
              <p className="fs-label mb-1.5 text-[#94A3B8]">Completion Photo</p>
              <div className="flex h-28 items-center justify-center rounded-card border border-dashed border-gray-200 bg-gray-50/60">
                <div className="text-center">
                  {/* Camera icon inline to avoid import */}
                  <svg className="mx-auto text-gray-300" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p className="mt-1.5 text-[11px] text-gray-400">No photo uploaded</p>
                </div>
              </div>
            </div>

            {/* Admin notes */}
            <label className="block">
              <span className="fs-label mb-1.5 block text-[#94A3B8]">
                Admin Notes{" "}
                <span className="normal-case text-gray-300">(optional)</span>
              </span>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes before closing…"
                className="w-full resize-none rounded-input border border-black/8 bg-white px-3 py-2.5 text-[13px] text-[#0F172A] outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/15"
              />
            </label>

            <p className="text-center text-[11px] text-[#94A3B8]">
              Client will be notified when you verify.
            </p>
          </div>

          {/* Footer */}
          <div className="fs-modal-footer-bar">
            <button
              type="button"
              onClick={handleReject}
              className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button border border-red-200 bg-white px-4 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleVerify}
              className="fs-btn-press fs-focus-ring flex h-9 items-center rounded-button px-4 text-[13px] font-medium text-white"
              style={{
                background: "linear-gradient(180deg, #22C55E 0%, #16A34A 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Verify &amp; Close Job
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function formatDateTime(value) {
  const date = new Date(value);
  const day  = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${day} · ${time}`;
}
