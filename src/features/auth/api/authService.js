import { mockUsers } from "../../../mock/mockUsers";

const wait = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));
const USERS_KEY = "campus-mind.mock-users";

function users() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : mockUsers;
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
  localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, user]));
  return wait({ ...user, password: undefined });
}
