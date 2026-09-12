import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export function ProfilePageSkeleton() {
  return (
    <div
      className="mx-auto min-h-dvh max-w-6xl px-3 py-3 sm:px-6 lg:py-6 animate-in fade-in duration-200"
      role="status"
      aria-label="Loading profile content"
    >
      {/* Back button placeholder */}
      <div className="mb-4">
        <Skeleton className="h-8 w-20 rounded-lg bg-border/40" />
      </div>

      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
          <Skeleton className="h-40 sm:h-56 w-full rounded-none bg-border/40" />
          <div className="px-4 pb-6 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div className="relative -mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-surface bg-surface shadow-sm">
                <Skeleton className="h-full w-full rounded-full bg-border/60" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28 rounded-xl bg-border/40" />
                <Skeleton className="h-9 w-9 rounded-xl bg-border/40" />
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <Skeleton className="h-7 w-44 sm:w-60 bg-border/60" />
              <Skeleton className="h-4 w-28 bg-border/40" />
              <Skeleton className="h-4 w-64 sm:w-96 bg-border/40" />
            </div>
          </div>
        </div>

        {/* Details Card Skeleton */}
        <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6 space-y-4">
          <Skeleton className="h-6 w-52 bg-border/60" />
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20 bg-border/40" />
              <Skeleton className="h-5 w-36 bg-border/50" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20 bg-border/40" />
              <Skeleton className="h-5 w-32 bg-border/50" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20 bg-border/40" />
              <Skeleton className="h-5 w-28 bg-border/50" />
            </div>
          </div>
        </div>

        {/* Classes Tabs & Grid Skeleton */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
          <div className="flex gap-2 border-b border-border p-2">
            <Skeleton className="h-8 w-20 rounded-lg bg-border/60" />
            <Skeleton className="h-8 w-20 rounded-lg bg-border/30" />
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Skeleton className="h-56 rounded-2xl bg-border/30" />
              <Skeleton className="h-56 rounded-2xl bg-border/30" />
              <Skeleton className="h-56 rounded-2xl bg-border/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageSkeleton;
