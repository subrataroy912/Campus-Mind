import { useMemo } from "react";
import { useGetExplorePeopleRecommendationsQuery } from "../api/exploreApi.js";
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

  const {
    data: recData,
    isLoading,
    isFetching,
    isError,
  } = useGetExplorePeopleRecommendationsQuery(
    { page: 0, size: 20 },
    { skip: !enabled },
  );

  const recommendations = recData?.content || EMPTY_USERS;

  const filteredPeople = useMemo(
    () =>
      filterAndSortPeople(recommendations, {
        searchQuery,
        personFilter,
        currentUser: effectiveCurrentUser,
      }),
    [recommendations, searchQuery, personFilter, effectiveCurrentUser],
  );

  return {
    users: recommendations,
    recommendations,
    filteredPeople,
    currentUser: effectiveCurrentUser,
    isLoading,
    isFetching,
    isError,
  };
}
