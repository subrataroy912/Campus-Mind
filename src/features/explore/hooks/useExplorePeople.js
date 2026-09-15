import { useMemo } from "react";
import { useGetExplorePeopleQuery } from "../api/exploreApi.js";
import { filterAndSortPeople } from "../model/peopleFilter.js";

export function useExplorePeople({
  searchQuery = "",
  personFilter = "all",
  currentUser = null,
  enabled = true,
} = {}) {
  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
  } = useGetExplorePeopleQuery(undefined, {
    skip: !enabled,
  });

  const departments = useMemo(
    () => [...new Set(users.map((item) => item.department).filter(Boolean))],
    [users]
  );

  const filteredPeople = useMemo(
    () =>
      filterAndSortPeople(users, {
        searchQuery,
        personFilter,
        currentUser,
      }),
    [users, searchQuery, personFilter, currentUser]
  );

  return {
    users,
    filteredPeople,
    departments,
    isLoading,
    isFetching,
    isError,
  };
}
