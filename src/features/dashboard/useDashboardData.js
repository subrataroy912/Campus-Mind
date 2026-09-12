import { useMemo } from "react";
import { useFetchClassroomsQuery } from "../classroom/api/classroomApi.js";
import { useGetExploreFeedQuery } from "../explore/api/exploreApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useDashboardData() {
  const { authStatus } = useAuth();
  const skip = authStatus === "hydrating";
  const classroomsQuery = useFetchClassroomsQuery(undefined, { skip });
  const exploreQuery = useGetExploreFeedQuery({ page: 0, size: 20 }, { skip });

  const classrooms = useMemo(() => {
    return classroomsQuery.data?.data ?? classroomsQuery.data ?? [];
  }, [classroomsQuery.data]);

  const exploreClassrooms = useMemo(() => {
    return exploreQuery.data?.content ?? [];
  }, [exploreQuery.data]);

  const isLoading = classroomsQuery.isLoading || exploreQuery.isLoading;
  const isError = classroomsQuery.isError || exploreQuery.isError;

  const status = isLoading ? "loading" : isError ? "error" : "ready";

  return {
    classrooms,
    exploreClassrooms,
    status,
  };
}

