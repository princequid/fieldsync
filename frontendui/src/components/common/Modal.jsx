import { useEffect, useRef } from "react";

/**
 * Base modal shell used by all admin modals.
 * Entry: scale-0.95 → 1 over 200ms cubic-bezier(0.34, 1.56, 0.64, 1)
 * Exit:  scale-1 → 0.95 over 150ms ease-in, driven by `closing` prop
 *
 * The consuming modal manages `closing` state and passes an `animatedClose`
 * as `onClose` so every close path (backdrop, Escape, inner buttons)
 * triggers the exit animation first.
 */
export default function Modal({
  onClose,
  children,
  maxWidth = "max-w-md",
  closing = false,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();

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
  }, [onClose]);

  useEffect(() => {
    if (!panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length) {
      focusables[0].focus();
    }
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          closing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
        }
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.45)",
        }}
        onClick={onClose}
        aria-hidden
      />

      {/* Scroll container */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 16px",
          overflowY: "auto",
        }}
      >
        {/* Card — entry/exit animation + width constraint on same element */}
        <div
          ref={panelRef}
          className={[
            "w-full overflow-hidden border border-transparent bg-white dark:border-gray-800 dark:bg-gray-900",
            maxWidth,
            closing ? "animate-modal-card-out" : "animate-modal-card-in",
          ].join(" ")}
          style={{
            borderRadius: "var(--radius-modal, 6px)",
            boxShadow: "var(--shadow-1)",
          }}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </>
  );
}
