import { Loader2 } from "lucide-react";
import EmptyState from "@/components/common/EmptyState.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import FilterButton from "./FilterButton.jsx";
import ExploreCardSkeleton from "./ExploreCardSkeleton.jsx";
import ExplorePagination from "./ExplorePagination.jsx";
import { BUILT_IN_CLASS_FILTERS } from "../model/exploreConstants.js";

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
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {BUILT_IN_CLASS_FILTERS.map((f) => (
          <FilterButton
            key={f.id}
            active={classFilter === f.id}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}
        {classSubjects.map((subject) => (
          <FilterButton
            key={subject}
            active={classFilter === subject}
            onClick={() => onFilterChange(subject)}
          >
            {subject}
          </FilterButton>
        ))}
      </div>

      {isLoading && !pageData ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ExploreCardSkeleton key={index} />
          ))}
        </div>
      ) : classes.length ? (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            {classFilter === "recommended" ? (
              <h2 className="text-lg font-semibold text-text-heading">
                Recommended courses
              </h2>
            ) : (
              <span />
            )}
            {(isPlaceholderData || isFetching) && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-150 ${
              isPlaceholderData
                ? "opacity-60 pointer-events-none"
                : "opacity-100"
            }`}
          >
            {classes.map((classroom) => (
              <ExploreClassCard
                key={classroom.courseId || classroom.id || classroom._id}
                classroom={classroom}
              />
            ))}
          </div>
          <ExplorePagination
            page={pageData?.page ?? page}
            totalPages={pageData?.totalPages ?? 0}
            first={pageData?.first ?? true}
            last={pageData?.last ?? true}
            isFetching={isFetching}
            onPrevious={onPreviousPage}
            onNext={onNextPage}
          />
        </section>
      ) : (
        <div className="mt-6">
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
    </>
  );
}
