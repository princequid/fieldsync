import { useEffect, useMemo, useRef, useState } from "react";
import ErrorState from "./ErrorState";
import { GenericPageSkeleton } from "./skeletons/PageSkeletons";

const CROSSFADE_MS = 300;
const MIN_SKELETON_MS = 280;

/**
 * Data-loading shell with skeleton crossfade and stable layout (no jump).
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
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const [contentVisible, setContentVisible] = useState(!loading && !error);
  const loadStartedAt = useRef(Date.now());

  const skeletonNode = useMemo(() => {
    if (typeof skeleton === "function") return skeleton();
    if (skeleton) return skeleton;
    return <GenericPageSkeleton className={className} />;
  }, [skeleton, className]);

  useEffect(() => {
    if (loading) {
      loadStartedAt.current = Date.now();
      setContentVisible(false);
      setShowSkeleton(true);
      return undefined;
    }

    if (error) {
      setShowSkeleton(false);
      setContentVisible(true);
      return undefined;
    }

    const elapsed = Date.now() - loadStartedAt.current;
    const remaining = Math.max(0, MIN_SKELETON_MS - elapsed);

    const revealTimer = window.setTimeout(() => {
      setContentVisible(true);
    }, remaining);

    const hideSkTimer = window.setTimeout(
      () => setShowSkeleton(false),
      remaining + CROSSFADE_MS,
    );

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideSkTimer);
    };
  }, [loading, error]);

  const shellClass = `fs-async-shell ${className}`.trim();

  if (error && !loading) {
    return (
      <div className={shellClass}>
        <div className="fs-async-panel fs-async-panel--visible fs-content-settled">
          <ErrorState thing={thing} message={error} onRetry={onRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {!loading && !error && (
        <div
          className={[
            "fs-async-panel",
            contentVisible
              ? "fs-async-panel--visible fs-content-settled"
              : "fs-async-panel--hidden",
          ].join(" ")}
        >
          {children}
        </div>
      )}

      {showSkeleton && (
        <div
          className={[
            "fs-async-panel fs-async-panel--overlay",
            loading || !contentVisible
              ? "fs-async-panel--visible"
              : "fs-async-panel--hidden",
          ].join(" ")}
          aria-hidden={!loading && contentVisible}
        >
          {skeletonNode}
        </div>
      )}
    </div>
  );
}
