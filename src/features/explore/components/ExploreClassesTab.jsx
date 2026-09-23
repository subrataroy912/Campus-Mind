import { useMemo } from "react";
import { Flame, Loader2, Sparkles } from "lucide-react";
import EmptyState from "@/components/common/EmptyState.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import FilterButton from "./FilterButton.jsx";
import ExploreCardSkeleton from "./ExploreCardSkeleton.jsx";
import ExplorePagination from "./ExplorePagination.jsx";
import { BUILT_IN_CLASS_FILTERS } from "../model/exploreConstants.js";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";

export default function ExploreClassesTab({
  classes = [],
  pageData = null,
  page = 0,
  classFilter = "all",
  classSubjects = [],
  debouncedSearchQuery = "",
  isLoading = false,
  isFetching = false,
  isPlaceholderData = false,
  onFilterChange,
  onPreviousPage,
  onNextPage,
}) {
  const isDefaultBrowse =
    classFilter === "all" && !debouncedSearchQuery && page === 0;
  const trendingItems = isDefaultBrowse ? classes.slice(0, 4) : [];
  const mainGridItems = isDefaultBrowse ? classes.slice(4) : classes;

  const { classrooms = [] } = useDashboardData({ includeExplore: false });
  const enrolledIds = useMemo(() => {
    const ids = new Set();
    for (const item of classrooms) {
      if (item.id) ids.add(item.id);
      if (item.courseId) ids.add(item.courseId);
      if (item.classId) ids.add(item.classId);
      if (item._id) ids.add(item._id);
    }
    return ids;
  }, [classrooms]);

  // Fix 1: Better skeleton logic to cover filter changes/refetches when data is empty
  const hasClasses = classes.length > 0;
  const showSkeletons = isLoading || (isFetching && !hasClasses);

  return (
    <div className="flex flex-col gap-3.5">
      {/* 1. Persistent Filter & Subject Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {BUILT_IN_CLASS_FILTERS.map((f) => (
          <FilterButton
            key={f.id}
            active={classFilter === f.id}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}

        {classSubjects.length > 0 && (
          <>
            <span className="mx-1 h-3.5 w-px bg-border/80" aria-hidden="true" />
            {classSubjects.map((subject) => (
              <FilterButton
                key={subject}
                active={classFilter === subject}
                onClick={() => onFilterChange(subject)}
              >
                {subject}
              </FilterButton>
            ))}
          </>
        )}
      </div>

      {/* 2. Content Area */}
      {/* Fix 2: Wrap all states in the exact same section container to prevent layout jumps */}
      <section className="flex flex-col gap-4">
        {showSkeletons ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ExploreCardSkeleton key={index} />
            ))}
          </div>
        ) : hasClasses ? (
          <>
            {/* Status Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {classFilter === "recommended" ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Recommended courses
                    </h2>
                  </>
                ) : debouncedSearchQuery ? (
                  <p className="text-xs text-muted-foreground">
                    Search results for{" "}
                    <span className="font-medium text-foreground">
                      "{debouncedSearchQuery}"
                    </span>
                  </p>
                ) : null}
              </div>

              {(isPlaceholderData || isFetching) && (
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>

            {/* Curated Trending Shelf */}
            {trendingItems.length > 0 && (
              <div className="flex flex-col gap-2.5 rounded-xl border bg-muted/20 p-3 sm:p-3.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Trending this week
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {trendingItems.map((classroom) => (
                    <ExploreClassCard
                      key={classroom.courseId || classroom.id || classroom._id}
                      classroom={classroom}
                      isEnrolled={enrolledIds.has(
                        classroom.courseId ||
                          classroom.id ||
                          classroom._id ||
                          classroom.classId,
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div
              className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 transition-opacity duration-150 ${
                isPlaceholderData
                  ? "pointer-events-none opacity-60"
                  : "opacity-100"
              }`}
            >
              {(isDefaultBrowse ? mainGridItems : classes).map((classroom) => (
                <ExploreClassCard
                  key={classroom.courseId || classroom.id || classroom._id}
                  classroom={classroom}
                  isEnrolled={enrolledIds.has(
                    classroom.courseId ||
                      classroom.id ||
                      classroom._id ||
                      classroom.classId,
                  )}
                />
              ))}
            </div>

            {/* Pagination */}
            <ExplorePagination
              page={pageData?.page ?? page}
              totalPages={pageData?.totalPages ?? 0}
              first={pageData?.first ?? true}
              last={pageData?.last ?? true}
              isFetching={isFetching}
              onPrevious={onPreviousPage}
              onNext={onNextPage}
            />
          </>
        ) : (
          <div className="pt-4">
            <EmptyState
              title={
                debouncedSearchQuery
                  ? "No courses matched your search."
                  : classFilter !== "all" &&
                      classFilter !== "popular" &&
                      classFilter !== "recommended"
                    ? "No public courses found for this subject."
                    : classFilter === "recommended"
                      ? "No recommendations available."
                      : "No public courses found."
              }
              description={isFetching ? "Loading courses..." : undefined}
            />
          </div>
        )}
      </section>
    </div>
  );
}
