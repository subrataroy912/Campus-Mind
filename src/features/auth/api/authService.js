import { mockUsers } from "../../../mock/mockUsers";

const wait = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));
const USERS_KEY = "campus-mind.mock-users";

function users() {
  try {
    const stored = window.localStorage.getItem(USERS_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed : mockUsers;
  } catch {
    return mockUsers;
  }
}

export async function login({ email, password }) {
  const user = users().find(
    (candidate) =>
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password,
  );
  if (!user)
    throw new Error("Use Dummy email ids , or create a local account.");
  return wait({ ...user, password: undefined });
}

export async function register({ name, email, password }) {
  const existingUsers = users();
  if (
    existingUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    )
  )
    throw new Error("An account with this email already exists.");
  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: "student",
    avatar: "/images/avatar.png",
  };
  window.localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, user]));
  return wait({ ...user, password: undefined });
}

export async function updateProfile(userId, details) {
  const existingUsers = users();
  const userIndex = existingUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) throw new Error("User account could not be found.");

  const updatedUser = { ...existingUsers[userIndex], ...details };
  const nextUsers = existingUsers.map((user, index) =>
    index === userIndex ? updatedUser : user,
  );

  window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  return wait({ ...updatedUser, password: undefined });
}

export async function deleteAccount(userId) {
  const remainingUsers = users().filter((user) => user.id !== userId);
  window.localStorage.setItem(USERS_KEY, JSON.stringify(remainingUsers));
}
