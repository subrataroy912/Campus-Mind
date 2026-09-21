import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-3 sm:px-6">
      {/* 1. Header Skeleton */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4 sm:p-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-48 sm:w-64" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-16 w-24 rounded-lg sm:h-20 sm:w-32" />
      </div>

      {/* 2. "My Spaces" Carousel/Row Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-44" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>

        {/* 3 Compact Card Skeletons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card p-0"
            >
              {/* Cover skeleton */}
              <Skeleton className="h-16 w-full rounded-none" />
              {/* Content skeleton */}
              <div className="flex flex-col gap-2 p-2.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center justify-between border-t border-border/40 pt-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. "Suggested for you" Section Skeleton */}
      <div className="flex flex-col gap-2.5 rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card p-0"
            >
              <Skeleton className="h-16 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-2.5">
                <Skeleton className="h-3.5 w-32" />
                <div className="flex items-center justify-between border-t border-border/40 pt-1.5">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
