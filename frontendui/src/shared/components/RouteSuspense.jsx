import { Suspense } from "react";
import { RouteChunkSkeleton } from "./skeletons/PageSkeletons";

/**
 * Suspense boundary for lazy-loaded routes with a branded skeleton fallback.
 */
export default function RouteSuspense({ children, fallback = null }) {
  return (
    <Suspense fallback={fallback ?? <RouteChunkSkeleton />}>{children}</Suspense>
  );
}
