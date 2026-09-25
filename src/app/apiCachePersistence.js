import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
} from "@/utils/storage.js";
import { getPersistedUserId } from "@/utils/sessionStorage.js";

const STORAGE_KEY = "campus-mind.api-cache.v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours stale-while-revalidate window
const MAX_BYTES = 512 * 1024; // 512 KB budget
const PERSISTED_ENDPOINTS = new Set([
  "fetchClassrooms",
  "findClassroomById",
  "getCourseworkList",
  "getClassroomRoster",
  "getCurrentProfile",
  "getPublicProfile",
  "listNotifications",
  "getExploreFeed",
  "getExploreRecommendations",
  "getExplorePeopleRecommendations",
  "getPublicCourse",
  "getSpaceChatRooms",
  "listMySpaceRooms",
  "getSpaceChatHistory",
  "getPendingJoinRequests",
  "getCourseGradebook",
  "getStudentGradebook",
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

    const rawApiState = stored.apiState;
    if (rawApiState && rawApiState.queries && typeof rawApiState.queries === "object") {
      // Refresh fulfilledTimeStamp so RTK Query immediately serves warm data (isLoading: false)
      // while still allowing background revalidation (ifOlderThan: 60)
      const warmTimestamp = Date.now() - 30 * 1000;
      const hydratedQueries = {};
      for (const [key, query] of Object.entries(rawApiState.queries)) {
        if (query && typeof query === "object") {
          hydratedQueries[key] = {
            ...query,
            fulfilledTimeStamp: warmTimestamp,
          };
        }
      }
      return {
        ...rawApiState,
        queries: hydratedQueries,
      };
    }

    return rawApiState;
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
    Object.entries(apiState.queries || {}).filter(
      ([, query]) =>
        PERSISTED_ENDPOINTS.has(query.endpointName) &&
        query.status === "fulfilled" &&
        query.data !== undefined
    )
  );

  try {
    const payload = {
      version: 1,
      userId,
      savedAt: Date.now(),
      apiState: {
        ...apiState,
        queries,
        mutations: {},
        subscriptions: {},
      },
    };

    let serialized = JSON.stringify(payload);

    if (serialized.length > MAX_BYTES) {
      // Exceeds 512 KB budget: progressively retain the highest-priority queries
      const priorityOrder = [
        "getCurrentProfile",
        "fetchClassrooms",
        "getSpaceChatRooms",
        "listMySpaceRooms",
        "getExploreFeed",
        "findClassroomById",
        "getCourseworkList",
        "getClassroomRoster",
        "getSpaceChatHistory",
        "getExplorePeopleRecommendations",
        "getPublicProfile",
        "listNotifications",
      ];
      const trimmedQueries = {};
      for (const endpoint of priorityOrder) {
        for (const [key, q] of Object.entries(queries)) {
          if (q.endpointName === endpoint) {
            trimmedQueries[key] = q;
          }
        }
        payload.apiState.queries = { ...trimmedQueries };
        const candidate = JSON.stringify(payload);
        if (candidate.length <= MAX_BYTES) {
          serialized = candidate;
        } else {
          break;
        }
      }
    }

    if (serialized.length <= MAX_BYTES) {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch {
    // Storage can be unavailable or full; memory caching still works.
  }
}

export function clearPersistedApiState() {
  safeLocalStorageRemove(STORAGE_KEY);
}
