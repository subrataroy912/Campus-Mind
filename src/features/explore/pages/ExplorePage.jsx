import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { getSharedClassCount } from "@/utils/sharedClasses.js";
import ExplorePersonCard from "../components/ExplorePersonCard.jsx";
import { useExploreData } from "../hooks/useExploreData.js";
import { useGetExplorePeopleQuery } from "../api/exploreApi.js";

const matches = (value, query) =>
  value.toLowerCase().includes(query.toLowerCase());

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "classes";
  const classFilter = searchParams.get("classFilter") || "all";
  const personFilter = searchParams.get("personFilter") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const {
    classes,
    page: pageData,
    query,
    status,
  } = useExploreData({
    searchQuery: debouncedSearchQuery,
    classFilter,
    page,
  });
  const { data: users = [] } = useGetExplorePeopleQuery();

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

  const classSubjects = [
    ...new Set(classes.map((item) => item.subject).filter(Boolean)),
  ];
  const departments = [
    ...new Set(users.map((item) => item.department).filter(Boolean)),
  ];
  const sharedPeople = useMemo(
    () => users.filter((person) => getSharedClassCount(user, person) > 0),
    [user, users]
  );
  const generalPeople = users;

  const filteredClasses = classes;

  const filteredPeople = useMemo(() => {
    const selfResult =
      searchQuery &&
      matches(
        `${user?.name || ""} ${user?.handle || ""} ${user?.department || ""}`,
        searchQuery
      )
        ? [user]
        : [];
    return [...selfResult, ...generalPeople]
      .filter((person) => {
        if (personFilter === "all") return true;
        if (personFilter === "shared")
          return getSharedClassCount(user, person) > 0;
        return person.department === personFilter;
      })
      .filter((person) =>
        matches(
          `${person.name || ""} ${person.handle || ""} ${
            person.department || ""
          }`,
          searchQuery
        )
      )
      .sort(
        (a, b) =>
          getSharedClassCount(user, b) - getSharedClassCount(user, a) ||
          Number(b.department === user?.department) -
            Number(a.department === user?.department) ||
          (a.name || "").localeCompare(b.name || "")
      );
  }, [generalPeople, personFilter, searchQuery, user]);

  if (query.isLoading && !pageData)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (status === "error")
    return (
      <div className="mx-auto max-w-7xl p-4">
        <EmptyState
          title="We could not load Explore"
          description="Please refresh and try again."
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-6">
      <header>
        <p className="text-sm font-semibold text-primary">
          CampusMind community
        </p>
        <h1 className="mt-1 text-3xl font-bold text-text-heading">Explore</h1>
        <p className="mt-2 text-text-muted">
          Find public courses across CampusMind.
        </p>
      </header>
      <div className="relative mt-6 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search public courses"
          aria-label="Search public courses"
          className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="mt-5 flex gap-2 border-b border-border" role="tablist">
        <Button
          role="tab"
          aria-selected={tab === "classes"}
          variant={tab === "classes" ? "default" : "ghost"}
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
          aria-selected={tab === "people"}
          variant={tab === "people" ? "default" : "ghost"}
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("tab", "people");
              return next;
            });
          }}
        >
          People
        </Button>
      </div>
      {tab === "classes" ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterButton
              active={classFilter === "all"}
              onClick={() => handleClassFilterChange("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={classFilter === "popular"}
              onClick={() => handleClassFilterChange("popular")}
            >
              Popular
            </FilterButton>
            <FilterButton
              active={classFilter === "recommended"}
              onClick={() => handleClassFilterChange("recommended")}
            >
              Recommended
            </FilterButton>
            {classSubjects.map((subject) => (
              <FilterButton
                key={subject}
                active={classFilter === subject}
                onClick={() => handleClassFilterChange(subject)}
              >
                {subject}
              </FilterButton>
            ))}
          </div>
          {filteredClasses.length ? (
            <section className="mt-6">
              {classFilter === "recommended" && (
                <h2 className="mb-3 text-lg font-semibold text-text-heading">
                  Recommended courses
                </h2>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClasses.map((classroom) => (
                  <ExploreClassCard
                    key={classroom.courseId}
                    classroom={classroom}
                  />
                ))}
              </div>
              <ExplorePagination
                page={pageData?.page ?? page}
                totalPages={pageData?.totalPages ?? 0}
                first={pageData?.first ?? true}
                last={pageData?.last ?? true}
                isFetching={query.isFetching}
                onPrevious={() =>
                  setPage((current) => Math.max(0, current - 1))
                }
                onNext={() => setPage((current) => current + 1)}
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
                description={
                  query.isFetching ? "Loading courses..." : undefined
                }
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterButton
              active={personFilter === "all"}
              onClick={() => handlePersonFilterChange("all")}
            >
              All departments
            </FilterButton>
            <FilterButton
              active={personFilter === "shared"}
              onClick={() => handlePersonFilterChange("shared")}
            >
              Shares a class with you
            </FilterButton>
            {departments.map((department) => (
              <FilterButton
                key={department}
                active={personFilter === department}
                onClick={() => handlePersonFilterChange(department)}
              >
                {department}
              </FilterButton>
            ))}
          </div>
          {sharedPeople.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-text-heading">
                People in your classes
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sharedPeople.map((person) => (
                  <ExplorePersonCard
                    key={person.id}
                    person={person}
                    currentUser={user}
                  />
                ))}
              </div>
            </section>
          )}
          {filteredPeople.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((person) => (
                <ExplorePersonCard
                  key={person.id}
                  person={person}
                  currentUser={user}
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
      )}
    </div>
  );
}

function ExplorePagination({
  page,
  totalPages,
  first,
  last,
  isFetching,
  onPrevious,
  onNext,
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className="mt-8 flex items-center justify-center gap-3"
      aria-label="Course pagination"
    >
      <Button
        variant="outline"
        disabled={first || isFetching}
        onClick={onPrevious}
      >
        Previous
      </Button>
      <span className="text-sm text-text-muted">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="outline" disabled={last || isFetching} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
