import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useExploreData } from "../hooks/useExploreData.js";
import { useExplorePeople } from "../hooks/useExplorePeople.js";
import ExploreHeroBanner from "../components/ExploreHeroBanner.jsx";
import ExploreClassesTab from "../components/ExploreClassesTab.jsx";
import ExplorePeopleTab from "../components/ExplorePeopleTab.jsx";
import { EXPLORE_TABS } from "../model/exploreConstants.js";

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || EXPLORE_TABS.CLASSES;
  const classFilter = searchParams.get("classFilter") || "all";
  const personFilter = searchParams.get("personFilter") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const isClassesTab = tab === EXPLORE_TABS.CLASSES;
  const isPeopleTab = tab === EXPLORE_TABS.PEOPLE;

  const {
    classes,
    page: pageData,
    query,
    status,
    isPlaceholderData,
    isFetching,
  } = useExploreData({
    searchQuery: debouncedSearchQuery,
    classFilter,
    page,
    keepPreviousData: true,
    enabled: isClassesTab,
  });

  const {
    filteredPeople,
    departments,
    isLoading: isLoadingUsers,
  } = useExplorePeople({
    searchQuery,
    personFilter,
    currentUser: user,
    enabled: isPeopleTab,
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const handleClassFilterChange = (filterVal) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filterVal === "all") next.delete("classFilter");
      else next.set("classFilter", filterVal);
      return next;
    });
    setPage(0);
  };

  const handlePersonFilterChange = (filterVal) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filterVal === "all") next.delete("personFilter");
      else next.set("personFilter", filterVal);
      return next;
    });
  };

  const classSubjects = useMemo(
    () => [...new Set(classes.map((item) => item.subject).filter(Boolean))],
    [classes]
  );

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
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-5">
      <div className="relative mt-4 w-full">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search public spaces, courses, topics..."
          aria-label="Search public spaces"
          className="h-9 w-full rounded-lg border border-border bg-surface pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
        />
      </div>

      <ExploreHeroBanner tab={tab} />

      <div className="mt-4 flex gap-1.5 border-b border-border" role="tablist">
        <Button
          role="tab"
          size="sm"
          aria-selected={isClassesTab}
          variant={isClassesTab ? "default" : "ghost"}
          className="h-8 px-3 text-xs rounded-lg"
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("tab");
              return next;
            });
          }}
        >
          Classes
        </Button>
        <Button
          role="tab"
          aria-selected={isPeopleTab}
          variant={isPeopleTab ? "default" : "ghost"}
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("tab", EXPLORE_TABS.PEOPLE);
              return next;
            });
          }}
        >
          People
        </Button>
      </div>

      {isClassesTab ? (
        <ExploreClassesTab
          classes={classes}
          pageData={pageData}
          page={page}
          classFilter={classFilter}
          classSubjects={classSubjects}
          debouncedSearchQuery={debouncedSearchQuery}
          isLoading={query.isLoading}
          isFetching={query.isFetching || isFetching}
          isPlaceholderData={isPlaceholderData}
          onFilterChange={handleClassFilterChange}
          onPreviousPage={() => setPage((current) => Math.max(0, current - 1))}
          onNextPage={() => setPage((current) => current + 1)}
        />
      ) : (
        <ExplorePeopleTab
          filteredPeople={filteredPeople}
          departments={departments}
          personFilter={personFilter}
          searchQuery={searchQuery}
          currentUser={user}
          isLoading={isLoadingUsers}
          onFilterChange={handlePersonFilterChange}
        />
      )}
    </div>
  );
}
