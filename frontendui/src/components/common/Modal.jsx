export default function Modal({ onClose, children, maxWidth = "max-w-md" }) {
  return (
    <>
      <div
        className="fs-modal-backdrop fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
        <div
          className={`fs-modal-panel relative w-full ${maxWidth} fs-shadow-elevated overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
