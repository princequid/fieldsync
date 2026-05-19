import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const SIZE_MAP = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

/**
 * Shared modal with built-in header (title + close button).
 * Manages its own closing animation state.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    /* Reset closing state when re-opened */
    setClosing(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") animatedClose();

      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length) {
      focusables[0].focus();
    }
  }, [isOpen]);

  function animatedClose() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 150);
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className={
          closing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
        }
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.60)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={animatedClose}
        aria-hidden
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          overflowY: "auto",
        }}
      >
        <div
          ref={panelRef}
          className={[
            "w-full",
            SIZE_MAP[size] ?? SIZE_MAP.md,
            closing ? "animate-modal-card-out" : "animate-modal-card-in",
          ].join(" ")}
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-modal, 16px)",
            boxShadow: "var(--shadow-4)",
            overflow: "hidden",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Spec header: 56px tall, #F1F5F9 bottom border */}
          <div className="fs-modal-header">
            {title ? (
              <h2 className="text-[15px] font-semibold text-[#0F172A]">
                {title}
              </h2>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={animatedClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#374151]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
