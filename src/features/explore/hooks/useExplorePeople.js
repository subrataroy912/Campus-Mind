import { useMemo } from "react";
import { useGetExplorePeopleQuery } from "../api/exploreApi.js";
import { filterAndSortPeople } from "../model/peopleFilter.js";
import { useAuth } from "@/context/AuthContext.jsx";

const EMPTY_USERS = [];

export function useExplorePeople({
  searchQuery = "",
  personFilter = "all",
  currentUser: propCurrentUser,
  enabled = true,
} = {}) {
  const { user } = useAuth();
  const effectiveCurrentUser =
    propCurrentUser !== undefined ? propCurrentUser : user;

  const { data, isLoading, isFetching, isError } = useGetExplorePeopleQuery(
    undefined,
    { skip: !enabled },
  );

  const users = data?.content || EMPTY_USERS;

  const departments = useMemo(
    () => [...new Set(users.map((item) => item.department).filter(Boolean))],
    [users],
  );
  const filteredPeople = useMemo(
    () =>
      filterAndSortPeople(users, {
        searchQuery,
        personFilter,
        currentUser: effectiveCurrentUser,
      }),
    [users, searchQuery, personFilter, effectiveCurrentUser],
  );

  return { users, filteredPeople, departments, isLoading, isFetching, isError };
}
