import { useEffect } from "react";
import { X } from "lucide-react";

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fs-modal-backdrop fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
        <div
          className={`fs-modal-panel relative w-full ${SIZE_MAP[size] ?? SIZE_MAP.md} fs-shadow-elevated overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA]`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
            {title ? (
              <h2 className="text-[15px] font-semibold text-gray-900">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className="fs-focus-ring flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#F3F4F6] hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
