import { useSelector } from "react-redux";
import { Flame, Sparkles } from "lucide-react";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import { InlineLoader } from "@/components/common/LoadingState.jsx";
import ExploreSpaceCard from "@/features/explore/components/ExploreSpaceCard.jsx";
import FilterButton from "./FilterButton.jsx";
import ExploreCardSkeleton from "./ExploreCardSkeleton.jsx";
import ExplorePagination from "./ExplorePagination.jsx";
import { BUILT_IN_CLASS_FILTERS } from "../model/exploreConstants.js";
import { selectEnrolledCourseIds } from "@/features/spaces/classroomSelectors.js";

export default function ExploreClassesTab({
  classes = [],
  pageData = null,
  page = 0,
  classFilter = "all",
  debouncedSearchQuery = "",
  isLoading = false,
  isFetching = false,
  isPlaceholderData = false,
  error = null,
  onRetry,
  onFilterChange,
  onPreviousPage,
  onNextPage,
}) {
  const isDefaultBrowse =
    classFilter === "all" && !debouncedSearchQuery && page === 0;
  const trendingItems = isDefaultBrowse ? classes.slice(0, 4) : [];
  const mainGridItems = isDefaultBrowse ? classes.slice(4) : classes;

  const enrolledIds = useSelector(selectEnrolledCourseIds);

  const hasClasses = classes.length > 0;
  const showSkeletons = isLoading || (isFetching && !hasClasses);

  return (
    <div className="flex flex-col gap-3.5">
      {/* 1. Persistent Filter Pills */}
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
      </div>

      {/* 2. Content Area */}
      <section className="flex flex-col gap-4">
        <AsyncStateBoundary
          isLoading={showSkeletons}
          hasData={hasClasses}
          error={error}
          errorTitle="Could not load public courses"
          onRetry={onRetry}
          loadingFallback={
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ExploreCardSkeleton key={index} />
              ))}
            </div>
          }
          isEmpty={!hasClasses}
          emptyTitle={
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
          emptyDescription={isFetching ? "Loading courses..." : undefined}
        >
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
                <InlineLoader label="Updating..." />
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
                    <ExploreSpaceCard
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
                <ExploreSpaceCard
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
        </AsyncStateBoundary>
      </section>
    </div>
  );
}
