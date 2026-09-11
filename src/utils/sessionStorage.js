import { safeParseStorageJson } from "./storage.js";

export const SESSION_KEY = "campus-mind.session";

export function getPersistedUserId() {
  const session = safeParseStorageJson(SESSION_KEY, null);
  if (!session || typeof session !== "object") return null;
  return session.user?.id ?? session.userId ?? session.id ?? null;
}
