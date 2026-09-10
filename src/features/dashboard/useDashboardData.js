import { useFetchClassroomsQuery } from "../classroom/api/classroomApi.js";
import { useGetExploreFeedQuery } from "../explore/api/exploreApi.js";

export function useDashboardData() {
  const classroomsQuery = useFetchClassroomsQuery();
  const exploreQuery = useGetExploreFeedQuery({ page: 0, size: 20 });
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
