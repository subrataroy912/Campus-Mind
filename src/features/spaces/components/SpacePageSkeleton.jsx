import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { FeedSkeleton } from "@/components/common/LoadingState.jsx";

export function SpacePageSkeleton() {
  return (
    <div
      className="w-full bg-canvas px-2.5 pt-2.5 pb-12 sm:px-4 sm:pt-3.5 sm:pb-16 lg:px-6 lg:pb-20 min-w-0 animate-in fade-in duration-200"
      role="status"
      aria-label="Loading classroom content"
    >
      <div className="mx-auto w-full max-w-7xl space-y-2.5 sm:space-y-3">
        {/* Header Card Skeleton matching SpaceHeader.jsx */}
        <div className="overflow-hidden rounded-xl bg-card border border-border/70 shadow-2xs">
          {/* Banner placeholder matching h-28 sm:h-36 md:h-44 lg:h-52 */}
          <Skeleton className="h-28 sm:h-36 md:h-44 lg:h-52 w-full rounded-none" />

          {/* Header Info area matching p-3 sm:px-5 sm:pb-3 sm:pt-0 */}
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pb-3 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Avatar placeholder matching -mt-7 sm:-mt-9 md:-mt-11 h-14 w-14 sm:h-18 sm:w-18 md:h-21 md:w-21 */}
              <div className="relative -mt-7 sm:-mt-9 md:-mt-11 h-14 w-14 sm:h-18 sm:w-18 md:h-21 md:w-21 z-10 shrink-0 overflow-hidden rounded-2xl border-2 sm:border-[3px] md:border-4 border-card bg-background shadow-md">
                <Skeleton className="h-full w-full rounded-none" />
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-5 w-48 sm:w-64" />
                <Skeleton className="h-3.5 w-36" />
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            </div>

            {/* Action buttons placeholder */}
            <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-end">
              <Skeleton className="h-8 w-full sm:w-28 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tab Pills placeholder matching SpaceTabs.jsx */}
        <div className="mt-2 flex gap-1 overflow-x-auto rounded-lg bg-muted/40 p-1 border border-border/60">
          <Skeleton className="h-7 w-16 rounded-md bg-card shadow-2xs" />
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-18 rounded-md" />
        </div>

        {/* SpaceHomeTab content placeholder */}
        <div className="mt-3 space-y-3.5">
          {/* About section matching CollapsibleSection */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2 border-t border-border">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-border">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          </div>

          {/* Stream Updates placeholder */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-44" />
            <FeedSkeleton count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpacePageSkeleton;

