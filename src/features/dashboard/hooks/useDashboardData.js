import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useFetchClassroomsQuery } from "../../classroom/api/classroomApi.js";
import { useGetExploreFeedQuery } from "../../explore/api/exploreApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

const EMPTY_ARRAY = Object.freeze([]);

export function useDashboardData({ includeExplore = true, skip = false } = {}) {
  const { isAuthenticated } = useAuth();
  const canFetchClassrooms = Boolean(isAuthenticated) && !skip;
  const classroomsQuery = useFetchClassroomsQuery(
    canFetchClassrooms ? undefined : skipToken,
  );
  const exploreQuery = useGetExploreFeedQuery(
    includeExplore && !skip ? { page: 0, size: 20 } : skipToken,
  );

  const classrooms = useMemo(() => {
    return Array.isArray(classroomsQuery.data)
      ? classroomsQuery.data
      : EMPTY_ARRAY;
  }, [classroomsQuery.data]);

  const exploreClassrooms = useMemo(() => {
    return exploreQuery.data?.content ?? EMPTY_ARRAY;
  }, [exploreQuery.data]);

  const isClassroomsLoading = canFetchClassrooms && classroomsQuery.isLoading;
  const isExploreLoading = includeExplore && exploreQuery.isLoading;
  const isClassroomsError = canFetchClassrooms && classroomsQuery.isError;
  const isExploreError = includeExplore && exploreQuery.isError;

  // Primary status tracks the core classrooms query so UI is not blocked by background explore feed
  const status = isClassroomsLoading
    ? "loading"
    : isClassroomsError
    ? "error"
    : "ready";

  const exploreStatus = isExploreLoading
    ? "loading"
    : isExploreError
    ? "error"
    : "ready";

  return {
    classrooms,
    exploreClassrooms,
    status,
    isClassroomsLoading,
    isExploreLoading,
    exploreStatus,
    classroomsQuery,
    exploreQuery,
  };
}
