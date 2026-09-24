import EmptyState from "@/components/common/EmptyState.jsx";
import { Sparkles } from "lucide-react";
import ExplorePersonCard from "./ExplorePersonCard.jsx";
import FilterButton from "./FilterButton.jsx";
import { BUILT_IN_PERSON_FILTERS } from "../model/exploreConstants.js";

export default function ExplorePeopleTab({
  filteredPeople = [],
  recommendations = [],
  departments = [],
  personFilter = "all",
  searchQuery = "",
  currentUser = null,
  isLoading = false,
  onFilterChange,
}) {
  const showSuggestedSection =
    (personFilter === "all" || personFilter === "recommended") &&
    !searchQuery.trim() &&
    recommendations.length > 0;

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
        {departments.map((department) => (
          <FilterButton
            key={department}
            active={personFilter === department}
            onClick={() => onFilterChange(department)}
          >
            {department}
          </FilterButton>
        ))}
      </div>

      {showSuggestedSection && (
        <section className="mt-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-text-heading">
                Suggested for you
              </h2>
            </div>
            {personFilter !== "recommended" && (
              <button
                type="button"
                onClick={() => onFilterChange("recommended")}
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                View all suggestions
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((person) => (
              <ExplorePersonCard
                key={`rec-${person.id}`}
                person={person}
                {...(currentUser ? { currentUser } : {})}
              />
            ))}
          </div>
        </section>
      )}

      {showSuggestedSection && personFilter === "all" && (
        <h2 className="mt-6 text-sm font-semibold text-text-heading">
          All Community Members
        </h2>
      )}

      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl border border-border bg-surface p-4 animate-pulse"
            />
          ))}
        </div>
      ) : filteredPeople.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <ExplorePersonCard
              key={person.id}
              person={person}
              {...(currentUser ? { currentUser } : {})}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No people found"
            description={
              searchQuery
                ? "Try adjusting your search query or department filter."
                : "No public profiles are currently discoverable."
            }
          />
        </div>
      )}
    </>
  );
}
