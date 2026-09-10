import { useFetchClassroomsQuery } from "../classroom/api/classroomApi.js";
import { useGetExploreFeedQuery } from "../explore/api/exploreApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useDashboardData() {
  const { authStatus } = useAuth();
  const skip = authStatus === "hydrating";
  const classroomsQuery = useFetchClassroomsQuery(undefined, { skip });
  const exploreQuery = useGetExploreFeedQuery({ page: 0, size: 20 }, { skip });
  const classrooms = classroomsQuery.data?.data ?? classroomsQuery.data ?? [];
  const exploreClassrooms = exploreQuery.data?.content ?? [];
  const isLoading = classroomsQuery.isLoading || exploreQuery.isLoading;
  const isError = classroomsQuery.isError || exploreQuery.isError;

  return {
    classrooms,
    exploreClassrooms,
    status: isLoading ? "loading" : isError ? "error" : "ready",
  };
}
