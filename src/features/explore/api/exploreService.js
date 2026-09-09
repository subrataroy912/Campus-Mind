import { fetchExploreClassrooms } from "@/features/classroom/api/classroomService.js";

export const fetchExploreClasses = async () => fetchExploreClassrooms();

export const fetchExploreUsers = async (currentUserId) => {
  void currentUserId;
  return [];
};
