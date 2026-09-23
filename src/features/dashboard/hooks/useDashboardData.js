import { useMemo } from "react";
import { useFetchClassroomsQuery } from "../../classroom/api/classroomApi.js";
import { useGetExploreFeedQuery } from "../../explore/api/exploreApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useDashboardData({ includeExplore = true } = {}) {
  const { isAuthenticated } = useAuth();
  const canFetchClassrooms = Boolean(isAuthenticated);
  const classroomsQuery = useFetchClassroomsQuery(undefined, {
    skip: !canFetchClassrooms,
  });
  const exploreQuery = useGetExploreFeedQuery(
    { page: 0, size: 20 },
    { skip: !includeExplore }
  );

  const classrooms = useMemo(() => {
    return classroomsQuery.data?.data ?? classroomsQuery.data ?? [];
  }, [classroomsQuery.data]);

  const exploreClassrooms = useMemo(() => {
    return exploreQuery.data?.content ?? [];
  }, [exploreQuery.data]);

  const isLoading =
    (canFetchClassrooms && classroomsQuery.isLoading) ||
    (includeExplore && exploreQuery.isLoading);
  const isError =
    (canFetchClassrooms && classroomsQuery.isError) ||
    (includeExplore && exploreQuery.isError);

  const status = isLoading ? "loading" : isError ? "error" : "ready";

  return {
    classrooms,
    exploreClassrooms,
    status,
  };
}
