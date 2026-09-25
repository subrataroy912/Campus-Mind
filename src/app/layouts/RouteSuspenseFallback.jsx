import { useLocation } from "react-router";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import HomeSkeleton from "@/features/dashboard/components/HomeSkeleton.jsx";
import SpaceListSkeleton from "@/features/spaces/components/SpaceListSkeleton.jsx";
import SpacePageSkeleton from "@/features/spaces/components/SpacePageSkeleton.jsx";
import ProfilePageSkeleton from "@/features/profile/components/ProfilePageSkeleton.jsx";
import ExploreCardSkeleton from "@/features/explore/components/ExploreCardSkeleton.jsx";
import {
  ChatLayoutSkeleton,
  FeedSkeleton,
  MemberListSkeleton,
  SectionLoader,
} from "@/components/common/LoadingState.jsx";
import { getSavedSpacesViewMode } from "@/features/spaces/utils/roles.js";

function SpaceListPageFallback() {
  const viewMode = getSavedSpacesViewMode();
  return (
    <div
      role="status"
      aria-label="Loading spaces"
      className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 min-w-0"
    >
      <header className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-7 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-72 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </header>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-1">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-60 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>

      <section className="pt-1">
        <SpaceListSkeleton viewMode={viewMode} count={6} />
      </section>
    </div>
  );
}

function ExplorePageFallback({ search }) {
  const isPeopleTab = search?.includes("tab=people");
  return (
    <div
      role="status"
      aria-label="Loading explore"
      className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 w-full min-w-0"
    >
      <div className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 space-y-1.5">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-80 max-w-full" />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="h-8 w-full sm:w-72 lg:w-80 rounded-lg" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {isPeopleTab ? (
        <MemberListSkeleton layout="grid" count={6} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ExploreCardSkeleton key={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Renders the exact page-level skeleton matching the active URL pathname so
 * lazy route transitions and session hydration never flash HomeSkeleton on
 * non-Home routes.
 */
export default function RouteSuspenseFallback() {
  const location = useLocation();
  const pathname = (location?.pathname || "/").toLowerCase();
  const search = location?.search || "";

  if (pathname === "/" || pathname === "/home") {
    return <HomeSkeleton />;
  }

  if (
    pathname === "/spaces" ||
    pathname === "/classes" ||
    pathname === "/dashboard/classes"
  ) {
    return <SpaceListPageFallback />;
  }

  if (
    pathname === "/spaces/join" ||
    pathname === "/spaces/new" ||
    pathname === "/classes/join" ||
    pathname === "/classes/new"
  ) {
    return (
      <div className="mx-auto w-full max-w-2xl px-3 py-6 sm:px-6">
        <SectionLoader />
      </div>
    );
  }

  if (
    pathname.startsWith("/spaces/") ||
    pathname.startsWith("/classes/") ||
    pathname.startsWith("/dashboard/classes/")
  ) {
    return <SpacePageSkeleton />;
  }

  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/users/") ||
    pathname.startsWith("/dashboard/profile")
  ) {
    return <ProfilePageSkeleton />;
  }

  if (
    pathname.startsWith("/messages") ||
    pathname.startsWith("/dashboard/messages")
  ) {
    return <ChatLayoutSkeleton />;
  }

  if (
    pathname.startsWith("/explore") ||
    pathname.startsWith("/dashboard/explore")
  ) {
    return <ExplorePageFallback search={search} />;
  }

  if (
    pathname.startsWith("/community") ||
    pathname.startsWith("/saved") ||
    pathname.startsWith("/dashboard/community") ||
    pathname.startsWith("/dashboard/saved")
  ) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-3 py-3 sm:px-6 sm:py-5">
        <FeedSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-6">
      <SectionLoader />
    </div>
  );
}
