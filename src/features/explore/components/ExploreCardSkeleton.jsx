import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function ExploreCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs">
      {/* 70% Banner Section matching h-40 sm:h-44 */}
      <div className="relative h-40 sm:h-44 w-full shrink-0 overflow-hidden bg-muted/50">
        <Skeleton className="h-full w-full rounded-none" />
        {/* Top Row Badge placeholder */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <Skeleton className="h-4 w-12 rounded-md bg-background/40" />
          <Skeleton className="h-4 w-14 rounded-md bg-background/40" />
        </div>
        {/* Bottom Row Avatar placeholder */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between z-10">
          <Skeleton className="h-9 w-9 rounded-xl border-2 border-card bg-background/70" />
          <Skeleton className="h-4 w-16 rounded-md bg-background/40" />
        </div>
      </div>

      {/* 30% Content Body matching p-2.5 sm:p-3 */}
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 min-w-0 bg-card">
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Footer Metadata Row */}
        <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-border/50 pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

