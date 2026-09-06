import { mockClassrooms } from "../../../mock/mockClassrooms";
import { exploreClassrooms } from "../../../mock/exploreClassrooms";

const STORAGE_KEY = "campus-mind.classrooms";
const storageKeyForUser = (userId) => `${STORAGE_KEY}.${userId}`;
const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));
const read = (userId) => {
  if (!userId) return [];
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(storageKeyForUser(userId)) || "null",
    );
    return Array.isArray(stored) ? stored : mockClassrooms;
  } catch {
    return mockClassrooms;
  }
};
const write = (userId, classrooms) =>
  window.localStorage.setItem(
    storageKeyForUser(userId),
    JSON.stringify(classrooms),
  );
const findAvailableClassroom = (userId, code) =>
  [...read(userId), ...exploreClassrooms].find((item) => item.code === code) || null;

export const fetchClassrooms = async (userId) => delay([...read(userId)]);
export const fetchExploreClassrooms = async () => delay([...exploreClassrooms]);
export const findClassroomById = async (userId, id) =>
  delay(read(userId).find((item) => item.id === id) || null);
export const findClassroomByCode = async (userId, code) =>
  delay(findAvailableClassroom(userId, code));
export const createClassroom = async (userId, details) => {
  const classroom = {
    ...details,
    id: `class-${Date.now()}`,
    title: details.className,
    subtitle: details.section || "New section",
    code: `${details.className.slice(0, 4).toUpperCase().padEnd(4, "X")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    instructor: { name: "You", avatar: null, initials: "YO" },
    role: "Created",
    memberCount: 1,
    onlineCount: 1,
    unreadCount: 0,
    deadline: null,
  };
  write(userId, [...read(userId), classroom]);
  return delay(classroom);
};
export const joinClassroom = async (userId, code) => {
  const classrooms = read(userId);
  const existing = classrooms.find((item) => item.code === code);
  if (existing) return delay(existing);
  const classroom = exploreClassrooms.find((item) => item.code === code);
  if (!classroom) return delay(null);
  const joinedClassroom = {
    ...classroom,
    role: "Joined",
    unreadCount: 0,
    deadline: null,
  };
  write(userId, [...classrooms, joinedClassroom]);
  return delay(joinedClassroom);
};
