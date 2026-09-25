import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import SpaceListSkeleton from "@/features/spaces/components/SpaceListSkeleton.jsx";

export function ProfilePageSkeleton() {
  return (
    <div
      className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 px-3 py-1 sm:gap-4 sm:px-6 animate-in fade-in duration-200"
      role="status"
      aria-label="Loading profile content"
    >
      {/* Back button placeholder matching h-9 sm:h-7 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 sm:h-7 w-16 rounded-md" />
      </div>

      {/* Header Skeleton matching ProfileHeader.jsx */}
      <header className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-none">
        <Skeleton className="h-24 sm:h-32 md:h-40 w-full rounded-none" />
        <div className="px-3.5 pb-3 sm:px-5 sm:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="relative -mt-7 sm:-mt-9 md:-mt-11 flex h-14 w-14 sm:h-18 sm:w-18 md:h-21 md:w-21 shrink-0 items-center justify-center rounded-full border-2 sm:border-[3px] md:border-4 border-card bg-surface shadow-md">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <div className="min-w-0 space-y-1.5 pb-0.5">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 sm:h-5 w-36 sm:w-48" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 self-start pt-1 sm:self-auto sm:pt-0">
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5 border-t border-border/40 pt-2">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
        </div>
      </header>

      {/* Details Card Skeleton matching ProfileDetails.jsx */}
      <section className="rounded-xl border border-border/70 bg-card p-3 shadow-none sm:p-3.5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5"
            >
              <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compact Tab Surface matching ProfilePage Spaces section */}
      <section className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 sm:p-4">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-52 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
        <SpaceListSkeleton viewMode="list" count={3} />
      </section>
    </div>
  );
}

export default ProfilePageSkeleton;

