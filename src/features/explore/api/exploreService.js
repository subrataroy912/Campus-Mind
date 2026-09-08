import { fetchExploreClassrooms } from "@/features/classroom/api/classroomService.js";
import { store } from "@/app/store.js";
import { dashboardApi } from "@/features/dashboard/api/dashboardApi.js";

export const fetchExploreClasses = async () => fetchExploreClassrooms();

export const fetchExploreUsers = async (currentUserId) => {
  const response = await store.dispatch(dashboardApi.endpoints.exploreUsers.initiate()).unwrap();
  const users = response?.data ?? response;
  return users.filter((user) => user.id !== currentUserId);
};
