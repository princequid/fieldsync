import Loader from "./Loader";
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
  children,
  className = "min-h-[40vh]",
}) {
  if (loading) {
    return (
      <div className={className}>
        <Loader centered />
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
