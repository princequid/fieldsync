import { useEffect } from "react";
import { X } from "lucide-react";

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  // Close on ESC
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
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Centred card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
        <div
          className={`relative w-full ${SIZE_MAP[size] ?? SIZE_MAP.md} rounded-4xl bg-white shadow-xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            {title ? (
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-2 rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
