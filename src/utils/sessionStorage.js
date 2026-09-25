import { safeParseStorageJson } from "./storage.js";

export const SESSION_KEY = "campus-mind.session";

export function getPersistedUserId() {
  const session = safeParseStorageJson(SESSION_KEY, null);
  if (!session || typeof session !== "object") return null;
  return session.user?.id ?? session.userId ?? session.id ?? null;
}

export function readPersistedAuthSession() {
  const session = safeParseStorageJson(SESSION_KEY, null);
  if (!session || typeof session !== "object") return null;
  const accessToken =
    typeof session.accessToken === "string" && session.accessToken.trim()
      ? session.accessToken.trim()
      : null;
  const user =
    session.user && typeof session.user === "object" ? session.user : null;
  if (!accessToken || !user) return null;
  return { accessToken, user };
}
