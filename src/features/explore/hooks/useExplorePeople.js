import { useMemo } from "react";
import {
  useGetExplorePeopleQuery,
  useGetExplorePeopleRecommendationsQuery,
} from "../api/exploreApi.js";
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

  const {
    data: recData,
    isLoading: isLoadingRecs,
    isFetching: isFetchingRecs,
  } = useGetExplorePeopleRecommendationsQuery(
    { page: 0, size: 6 },
    { skip: !enabled },
  );

  const rawUsers = data?.content || EMPTY_USERS;
  const recommendations = recData?.content || EMPTY_USERS;

  const recMap = useMemo(() => {
    const map = new Map();
    recommendations.forEach((r) => {
      if (r?.id) map.set(r.id, r);
    });
    return map;
  }, [recommendations]);

  const enrichedUsers = useMemo(() => {
    const combined = rawUsers.map((u) => {
      const rec = recMap.get(u.id);
      return rec ? { ...u, ...rec } : u;
    });

    recommendations.forEach((rec) => {
      if (rec?.id && !combined.some((u) => u.id === rec.id)) {
        combined.push(rec);
      }
    });

    return combined;
  }, [rawUsers, recommendations, recMap]);

  const departments = useMemo(() => {
    const map = new Map();
    for (const item of enrichedUsers) {
      const rawDept = item.department?.trim();
      if (rawDept) {
        const key = rawDept.toLowerCase();
        if (!map.has(key)) {
          map.set(key, rawDept);
        } else {
          const existing = map.get(key);
          if (existing === existing.toLowerCase() && rawDept !== rawDept.toLowerCase()) {
            map.set(key, rawDept);
          }
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [enrichedUsers]);

  const filteredPeople = useMemo(
    () =>
      filterAndSortPeople(enrichedUsers, {
        searchQuery,
        personFilter,
        currentUser: effectiveCurrentUser,
      }),
    [enrichedUsers, searchQuery, personFilter, effectiveCurrentUser],
  );

  return {
    users: enrichedUsers,
    recommendations,
    filteredPeople,
    departments,
    currentUser: effectiveCurrentUser,
    isLoading: isLoading || isLoadingRecs,
    isFetching: isFetching || isFetchingRecs,
    isError,
  };
}
