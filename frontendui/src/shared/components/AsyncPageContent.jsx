import ErrorState from "./ErrorState";

/**
 * Wraps page content with consistent loading / error handling.
 * Never renders children while loading or when error is set.
 */
export default function AsyncPageContent({
  loading,
  error,
  thing = "data",
  onRetry,
  skeleton = null,
  children,
  className = "min-h-[40vh]",
}) {
  if (loading) {
    if (typeof skeleton === "function") return skeleton();
    if (skeleton) return skeleton;
    return (
      <div className={`${className} p-6`} aria-hidden>
        <div className="space-y-3">
          <div className="fs-skeleton h-8 w-48 rounded-md" />
          <div className="fs-skeleton h-4 w-80 rounded-md" />
          <div className="fs-skeleton h-32 w-full rounded-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState thing={thing} message={error} onRetry={onRetry} />
      </div>
    );
  }

  return children;
}
