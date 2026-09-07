import { fetchExploreClassrooms } from "@/features/classroom/api/classroomService.js";
import { mockUsers } from "@/mock/mockUsers.js";

const USERS_KEY = "campus-mind.mock-users";
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300));

export const fetchExploreClasses = async () => fetchExploreClassrooms();

export const fetchExploreUsers = async (currentUserId) => {
  let storedUsers = [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
    storedUsers = Array.isArray(parsed) ? parsed : [];
  } catch {
    storedUsers = [];
  }

  const usersById = new Map(mockUsers.map((user) => [user.id, user]));
  storedUsers.forEach((user) => usersById.set(user.id, user));
  const users = [...usersById.values()].filter(
    (user) => user.id !== currentUserId && user.privacy?.discoverable !== false,
  );
  return delay(users);
};
