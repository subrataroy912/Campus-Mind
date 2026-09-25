import { Skeleton } from "@/components/ui/skeleton.jsx";
import ExploreCardSkeleton from "@/features/explore/components/ExploreCardSkeleton.jsx";

export function SpaceListSkeleton({ viewMode = "list", count = 6 }) {
  if (viewMode === "grid") {
    return (
      <div
        data-testid="space-list-skeleton-grid"
        className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, i) => (
          <ExploreCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid="space-list-skeleton-list"
      className="flex flex-col gap-2"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-14 w-full items-center justify-between gap-3 px-3 rounded-xl border border-border/70 bg-card"
        >
          <div className="flex min-w-0 items-center gap-2.5 flex-1">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="min-w-0 flex flex-col justify-center gap-1.5 flex-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3.5 w-40 max-w-[45%]" />
                <Skeleton className="h-4 w-12 rounded-md shrink-0" />
              </div>
              <Skeleton className="h-2.5 w-28 max-w-[35%]" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-3.5 w-8 rounded" />
            <Skeleton className="h-3.5 w-3.5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpaceListSkeleton;

