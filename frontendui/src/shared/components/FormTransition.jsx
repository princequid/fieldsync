import Loader from "./Loader";

/**
 * Wraps form content with mount fade-in and optional submitting state.
 */
export default function FormTransition({
  children,
  submitting = false,
  className = "",
}) {
  return (
    <div
      className={[
        "fs-form-shell",
        submitting ? "fs-form-shell--submitting" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="fs-form-enter">{children}</div>
      {submitting && (
        <div className="fs-form-submitting-overlay" aria-hidden>
          <Loader size="md" />
        </div>
      )}
    </div>
  );
}
