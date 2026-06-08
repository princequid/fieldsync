import { SkeletonBlock } from "../Skeleton";

export function SkeletonPageHeader({ titleWidth = "w-40", subtitleWidth = "w-72" }) {
  return (
    <header className="space-y-2">
      <SkeletonBlock className={`h-7 ${titleWidth} rounded-md`} />
      <SkeletonBlock className={`h-4 ${subtitleWidth} max-w-full rounded-md`} />
    </header>
  );
}

export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="fs-card rounded-card p-5">
          <SkeletonBlock className="h-3 w-20 rounded-md" />
          <SkeletonBlock className="mt-3 h-8 w-14 rounded-md" />
          <SkeletonBlock className="mt-3 h-3 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTableRows({ rows = 5, header = true }) {
  return (
    <div className="fs-card overflow-hidden">
      {header && (
        <div className="border-b border-black/5 px-5 py-4 dark:border-gray-800">
          <SkeletonBlock className="h-4 w-32 rounded-md" />
        </div>
      )}
      <div className="space-y-0 divide-y divide-black/5 dark:divide-gray-800">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-3.5 w-2/5 rounded-md" />
              <SkeletonBlock className="h-3 w-1/3 rounded-md" />
            </div>
            <SkeletonBlock className="hidden h-6 w-16 rounded-badge sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChartPanel({ height = "h-52" }) {
  return (
    <div className="fs-card overflow-hidden">
      <div className="border-b border-black/5 px-5 py-4 dark:border-gray-800">
        <SkeletonBlock className="h-4 w-44 rounded-md" />
        <SkeletonBlock className="mt-2 h-3 w-56 max-w-full rounded-md" />
      </div>
      <div className="p-5">
        <SkeletonBlock className={`${height} w-full rounded-card`} />
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-full p-6 dark:bg-gray-950">
      <div className="space-y-6">
        <SkeletonPageHeader />
        <SkeletonStatGrid />
        <div className="grid grid-cols-1 gap-5 xl:flex">
          <div className="xl:min-w-0 xl:flex-1">
            <SkeletonTableRows rows={6} />
          </div>
          <div className="space-y-4 xl:w-68 xl:shrink-0">
            <div className="fs-card p-5">
              <SkeletonBlock className="mx-auto h-36 w-36 rounded-full" />
              <div className="mt-5 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonBlock key={i} className="h-10 w-full rounded-card" />
                ))}
              </div>
            </div>
            <SkeletonBlock className="h-40 w-full rounded-card" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AllJobsPageSkeleton() {
  return (
    <div className="fs-admin-page-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="fs-card px-5 py-5">
          <SkeletonPageHeader titleWidth="w-32" subtitleWidth="w-80" />
        </div>
        <div className="fs-card p-5">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBlock key={i} className="h-8 w-20 rounded-button" />
            ))}
          </div>
          <SkeletonBlock className="mt-4 h-10 w-full max-w-md rounded-input" />
          <div className="mt-5">
            <SkeletonTableRows rows={8} header={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="fs-admin-page-bg space-y-6 p-4 sm:p-6">
      <div className="fs-card space-y-3 p-6">
        <SkeletonBlock className="h-4 w-24 rounded-md" />
        <SkeletonBlock className="h-8 w-48 rounded-md" />
        <SkeletonBlock className="h-4 w-72 max-w-full rounded-md" />
        <SkeletonBlock className="mt-2 h-10 w-56 rounded-card" />
      </div>
      <SkeletonStatGrid />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SkeletonChartPanel />
        <SkeletonChartPanel />
      </div>
      <SkeletonTableRows rows={4} />
    </div>
  );
}

export function TeamPageSkeleton() {
  return (
    <div className="fs-admin-page-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between">
          <SkeletonPageHeader titleWidth="w-28" subtitleWidth="w-64" />
          <SkeletonBlock className="h-10 w-36 rounded-button" />
        </div>
        <SkeletonTableRows rows={5} />
      </div>
    </div>
  );
}

export function ClientsPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SkeletonPageHeader titleWidth="w-32" subtitleWidth="w-24" />
        <SkeletonBlock className="h-10 w-32 rounded-button" />
      </div>
      <SkeletonTableRows rows={6} />
    </div>
  );
}

export function JobDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-bg p-6 dark:bg-gray-950">
      <SkeletonBlock className="h-4 w-28 rounded-md" />
      <SkeletonBlock className="mt-4 h-8 w-72 max-w-full rounded-md" />
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="fs-card p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <SkeletonBlock className="h-3 w-24 rounded-md" />
                  <SkeletonBlock className="h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <SkeletonChartPanel height="h-40" />
        </div>
        <div className="space-y-5">
          <div className="fs-card p-5">
            <SkeletonBlock className="h-4 w-24 rounded-md" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} className="h-10 w-full rounded-button" />
              ))}
            </div>
          </div>
          <div className="fs-card p-5">
            <SkeletonBlock className="h-4 w-32 rounded-md" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewJobPageSkeleton() {
  return (
    <div className="fs-admin-page-bg min-h-screen p-6 pb-28">
      <div className="fs-card mx-auto max-w-2xl p-8">
        <SkeletonPageHeader titleWidth="w-44" subtitleWidth="w-64" />
        <div className="mt-8 space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24 rounded-md" />
              <SkeletonBlock className="h-10 w-full rounded-input" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TechJobsPageSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex gap-1.5 overflow-x-auto px-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-8 w-20 shrink-0 rounded-badge" />
        ))}
      </div>
      <div className="space-y-2.5">
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="mx-3 flex min-h-20 overflow-hidden rounded-r-[16px] border border-black/5 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="w-1 shrink-0 bg-slate-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2.5 p-4">
              <SkeletonBlock className="h-4 w-2/3 rounded-md" />
              <SkeletonBlock className="h-3 w-1/2 rounded-md" />
              <SkeletonBlock className="h-3 w-1/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GenericPageSkeleton({ className = "min-h-[40vh] p-6" }) {
  return (
    <div className={className}>
      <SkeletonPageHeader />
      <SkeletonBlock className="mt-6 h-48 w-full rounded-card" />
    </div>
  );
}

export function RouteChunkSkeleton() {
  return <GenericPageSkeleton />;
}

export function AuthPageSkeleton() {
  return (
    <GenericPageSkeleton className="flex min-h-screen items-center justify-center p-6" />
  );
}
