import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
} from "@/utils/storage.js";
import { getPersistedUserId } from "@/utils/sessionStorage.js";

const STORAGE_KEY = "campus-mind.api-cache.v1";
const CACHE_TTL_MS = 5 * 60 * 1000;
const PERSISTED_ENDPOINTS = new Set([
  "fetchClassrooms",
  "findClassroomById",
  "getCurrentProfile",
  "getPublicProfile",
]);

function getUserId(authState) {
  return authState?.user?.id ?? getPersistedUserId();
}

export function readPersistedApiState(authState) {
  if (typeof window === "undefined") return undefined;

  try {
    const stored = JSON.parse(
      safeLocalStorageGet(STORAGE_KEY, "null") || "null"
    );
    const expectedUserId = getUserId(authState);
    if (!stored || stored.version !== 1 || stored.userId !== expectedUserId) {
      if (stored?.userId && stored.userId !== expectedUserId) {
        clearPersistedApiState();
      }
      return undefined;
    }

    if (Date.now() - stored.savedAt > CACHE_TTL_MS) {
      clearPersistedApiState();
      return undefined;
    }

    return stored.apiState;
  } catch {
    clearPersistedApiState();
    return undefined;
  }
}

export function persistApiState(apiState, authState) {
  if (typeof window === "undefined") return;

  const userId = getUserId(authState);
  if (!userId) return;

  const queries = Object.fromEntries(
    Object.entries(apiState.queries || {}).filter(([, query]) =>
      PERSISTED_ENDPOINTS.has(query.endpointName)
    )
  );

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        userId,
        savedAt: Date.now(),
        apiState: {
          ...apiState,
          queries,
          mutations: {},
          subscriptions: {},
        },
      })
    );
  } catch {
    // Storage can be unavailable or full; memory caching still works.
  }
}

export function clearPersistedApiState() {
  safeLocalStorageRemove(STORAGE_KEY);
}
