import RouteSuspense from "../shared/components/RouteSuspense";

/** Wrap a lazy component with a matching skeleton fallback. */
export function lazyRoute(LazyComponent, Skeleton) {
  return (
    <RouteSuspense fallback={Skeleton ? <Skeleton /> : undefined}>
      <LazyComponent />
    </RouteSuspense>
  );
}
