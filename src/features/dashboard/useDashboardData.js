import {
  useFetchClassroomsQuery,
  useFetchExploreClassroomsQuery,
} from "../classroom/api/classroomApi.js";

export function useDashboardData() {
  const classroomsQuery = useFetchClassroomsQuery();
  const exploreQuery = useFetchExploreClassroomsQuery();
  const classrooms = classroomsQuery.data?.data ?? classroomsQuery.data ?? [];
  const exploreClassrooms = exploreQuery.data?.data ?? exploreQuery.data ?? [];
  const isLoading = classroomsQuery.isLoading || exploreQuery.isLoading;
  const isError = classroomsQuery.isError || exploreQuery.isError;

  return {
    classrooms,
    exploreClassrooms,
    status: isLoading ? "loading" : isError ? "error" : "ready",
  };
}
