import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import { Sparkles } from "lucide-react";
import ExplorePersonCard from "./ExplorePersonCard.jsx";
import FilterButton from "./FilterButton.jsx";
import { BUILT_IN_PERSON_FILTERS } from "../model/exploreConstants.js";

export default function ExplorePeopleTab({
  filteredPeople = [],
  personFilter = "all",
  searchQuery = "",
  currentUser = null,
  isLoading = false,
  error = null,
  onRetry,
  onFilterChange,
}) {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {BUILT_IN_PERSON_FILTERS.map((f) => (
          <FilterButton
            key={f.id}
            active={personFilter === f.id}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}
      </div>

      <section className="mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-heading">
            Recommended for you
          </h2>
        </div>

        <AsyncStateBoundary
          isLoading={isLoading}
          hasData={filteredPeople.length > 0}
          error={error}
          errorTitle="Could not load people recommendations"
          onRetry={onRetry}
          loadingFallback="people-grid"
          isEmpty={filteredPeople.length === 0}
          emptyTitle="No recommendations yet"
          emptyDescription={
            searchQuery
              ? "Try adjusting your search query or filter."
              : "Join or create spaces to discover classmates and mutual space peers."
          }
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
            {filteredPeople.map((person) => (
              <ExplorePersonCard
                key={person.id}
                person={person}
                {...(currentUser ? { currentUser } : {})}
              />
            ))}
          </div>
        </AsyncStateBoundary>
      </section>
    </>
  );
}
