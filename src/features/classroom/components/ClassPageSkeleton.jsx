import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export function ClassPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-in fade-in duration-200"
      role="status"
      aria-label="Loading classroom content"
    >
      <div className="mx-auto max-w-6xl space-y-4">
        {/* Header Card Skeleton */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
          {/* Banner placeholder */}
          <Skeleton className="h-28 sm:h-36 w-full rounded-none bg-border/40" />

          {/* Header Info area */}
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              {/* Avatar placeholder */}
              <div className="-mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-surface bg-canvas sm:-mt-14 sm:h-24 sm:w-24">
                <Skeleton className="h-full w-full rounded-none bg-border/60" />
              </div>
              <div className="mb-1 sm:mb-2 space-y-2">
                <Skeleton className="h-6 w-48 sm:w-64 bg-border/60" />
                <Skeleton className="h-4 w-32 bg-border/40" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-16 bg-border/40" />
                  <Skeleton className="h-5 w-20 bg-border/40" />
                </div>
              </div>
            </div>
            {/* Action button placeholder */}
            <Skeleton className="h-10 w-full sm:w-32 rounded-xl bg-border/50" />
          </div>
        </div>

        {/* Tab Pills placeholder */}
        <div className="flex gap-2 rounded-xl bg-surface p-1 shadow-sm ring-1 ring-border">
          <Skeleton className="h-8 w-20 rounded-lg bg-border/60" />
          <Skeleton className="h-8 w-24 rounded-lg bg-border/30" />
          <Skeleton className="h-8 w-24 rounded-lg bg-border/30" />
          <Skeleton className="h-8 w-20 rounded-lg bg-border/30" />
        </div>

        {/* About section / Stream placeholder */}
        <div className="rounded-2xl bg-surface p-5 ring-1 ring-border shadow-xs sm:p-6 space-y-4">
          <Skeleton className="h-6 w-36 bg-border/60" />
          <Skeleton className="h-4 w-full bg-border/40" />
          <Skeleton className="h-4 w-3/4 bg-border/40" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-3 border-t border-border">
            <Skeleton className="h-14 rounded-xl bg-border/30" />
            <Skeleton className="h-14 rounded-xl bg-border/30" />
            <Skeleton className="h-14 rounded-xl bg-border/30" />
            <Skeleton className="h-14 rounded-xl bg-border/30" />
          </div>
        </div>

        {/* Post box placeholder */}
        <div className="rounded-2xl bg-surface p-4 ring-1 ring-border shadow-xs sm:p-5 space-y-3">
          <Skeleton className="h-5 w-40 bg-border/50" />
          <Skeleton className="h-20 w-full rounded-xl bg-border/30" />
        </div>
      </div>
    </div>
  );
}

export default ClassPageSkeleton;
