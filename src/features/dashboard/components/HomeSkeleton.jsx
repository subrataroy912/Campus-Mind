import { Skeleton } from "@/components/ui/skeleton.jsx";
import ExploreCardSkeleton from "@/features/explore/components/ExploreCardSkeleton.jsx";

export default function HomeSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 min-w-0"
    >
      {/* 1. "My spaces" Section Skeleton matching HomeSection + ContentList (carousel) */}
      <section className="flex flex-col gap-2.5 min-w-0 w-full">
        <div className="flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
          <div className="space-y-1 min-w-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-52" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-3.5 w-14" />
            <div className="hidden sm:flex items-center gap-1">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExploreCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* 2. "Suggested for you" Section Skeleton matching SuggestedSpacesSection */}
      <section className="flex flex-col gap-2 rounded-lg border border-border/70 bg-card/60 p-3 shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="hidden sm:inline-block h-3 w-36" />
          </div>
          <Skeleton className="h-3.5 w-16" />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ExploreCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

