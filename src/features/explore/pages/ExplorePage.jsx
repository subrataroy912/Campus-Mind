import { useState } from "react";
import { useSearchParams } from "react-router";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useExploreData } from "../hooks/useExploreData.js";
import { useExplorePeople } from "../hooks/useExplorePeople.js";
import ExploreHeroBanner from "../components/ExploreHeroBanner.jsx";
import ExploreClassesTab from "../components/ExploreClassesTab.jsx";
import ExplorePeopleTab from "../components/ExplorePeopleTab.jsx";
import { EXPLORE_TABS } from "../model/exploreConstants.js";
import SearchInput from "@/components/common/SearchInput.jsx";

const TABS = [
  { id: EXPLORE_TABS.CLASSES, label: "Classes", paramVal: null },
  { id: EXPLORE_TABS.PEOPLE, label: "People", paramVal: EXPLORE_TABS.PEOPLE },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || EXPLORE_TABS.CLASSES;
  const classFilter = searchParams.get("classFilter") || "all";
  const personFilter = searchParams.get("personFilter") || "all";

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const isClassesTab = tab === EXPLORE_TABS.CLASSES;
  const isPeopleTab = tab === EXPLORE_TABS.PEOPLE;

  const {
    classes = [],
    page: pageData,
    query,
    status,
    isPlaceholderData,
    isFetching,
  } = useExploreData({
    searchQuery,
    classFilter,
    page,
    keepPreviousData: true,
    enabled: isClassesTab,
  });

  const {
    filteredPeople = [],
    recommendations = [],
    currentUser,
    isLoading: isLoadingUsers,
  } = useExplorePeople({
    searchQuery,
    personFilter,
    enabled: isPeopleTab,
  });

  // Reusable URL parameter updater
  const updateParam = (key, value, resetPage = false) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
    if (resetPage) setPage(0);
  };

  if (status === "error") {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <EmptyState
          title="We could not load Explore"
          description="Please refresh and try again."
        />
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 w-full min-w-0">
      <ExploreHeroBanner tab={tab} />

      {/* Action Row: Compact Tab Pills & Search Input */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-8 w-fit items-center rounded-lg bg-muted p-1 text-muted-foreground">
          {TABS.map(({ id, label, paramVal }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => updateParam("tab", paramVal, true)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <SearchInput
          defaultValue={searchQuery}
          onChange={(debouncedVal) => {
            setSearchQuery(debouncedVal);
            setPage(0);
          }}
          placeholder="Search spaces, courses, topics..."
          className="sm:w-72 lg:w-80"
        />
      </div>

      {/* Tab Panels */}
      {isClassesTab ? (
        <ExploreClassesTab
          classes={classes}
          pageData={pageData}
          page={page}
          classFilter={classFilter}
          debouncedSearchQuery={searchQuery}
          isLoading={query.isLoading}
          isFetching={query.isFetching || isFetching}
          isPlaceholderData={isPlaceholderData}
          onFilterChange={(val) => updateParam("classFilter", val, true)}
          onPreviousPage={() => setPage((c) => Math.max(0, c - 1))}
          onNextPage={() => setPage((c) => c + 1)}
        />
      ) : (
        <ExplorePeopleTab
          filteredPeople={filteredPeople}
          recommendations={recommendations}
          personFilter={personFilter}
          searchQuery={searchQuery}
          currentUser={currentUser}
          isLoading={isLoadingUsers}
          onFilterChange={(val) => updateParam("personFilter", val)}
        />
      )}
    </div>
  );
}
