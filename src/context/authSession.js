import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { invalidateRefreshForDispatch } from "../app/refreshState.js";
import { clearCredentials, setSession } from "../features/auth/authSlice.js";
import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "../utils/storage.js";
import { getPersistedUserId, SESSION_KEY } from "../utils/sessionStorage.js";

export const LEGACY_AUTH_STORAGE_KEYS = ["accessToken"];
const LEGACY_MIGRATION_KEY = "campus-mind.migrated-legacy-auth-keys";

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function token(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

export function normalizeSession(record) {
  if (!isRecord(record)) return null;
  const source = isRecord(record.session) ? record.session : record;
  const accessToken = token(source.accessToken ?? source.token);
  if (!accessToken) return null;
  const nestedUser = isRecord(source.user) ? source.user : null;
  const {
    accessToken: _accessToken,
    token: _token,
    session: _session,
    user: _user,
    ...flatProfile
  } = source;
  const user = nestedUser ?? flatProfile;
  return {
    accessToken,
    user: isRecord(user) && Object.keys(user).length ? user : null,
  };
}

export function commitAuthSession(dispatch, record) {
  const session = normalizeSession(record);
  if (!session) {
    throw new Error("Cannot commit an invalid authenticated session.");
  }
  dispatch(setSession(session));
  return session;
}

export function mergeProfileIntoCurrentSession(getState, profile) {
  if (typeof getState !== "function") {
    throw new Error("Cannot merge an invalid profile response.");
  }

  const current = normalizeSession(getState()?.auth);
  if (!current) return null;

  if (!isRecord(profile)) {
    return current;
  }

  const user = {
    ...current.user,
    ...profile,
    name: profile.displayName || current.user?.name,
    avatar: profile.avatarUrl ?? current.user?.avatar ?? null,
    banner: profile.bannerUrl ?? current.user?.banner ?? null,
  };
  return { ...current, user };
}

export function isExpiredSessionError(error, endpoint) {
  const status =
    error?.status ?? error?.originalStatus ?? error?.response?.status;
  if (status === 401) return true;
  if (status !== 404) return false;
  const target = String(endpoint ?? "");
  return target.includes("/users/me");
}

export function getProtectedRouteState(authStatus, isAuthenticated) {
  if (authStatus === "hydrating") return "hydrating";
  return isAuthenticated ? "authenticated" : "unauthenticated";
}

export function routeRequiresSessionRestore(matches) {
  return matches.some((match) => match.handle?.requiresSessionRestore === true);
}

export async function hydratePersistedSession({
  session,
  installCredentials,
  getProfile,
}) {
  if (!session?.accessToken) {
    return { status: "succeeded", user: null };
  }

  installCredentials(session);
  try {
    return { status: "succeeded", user: session, profile: await getProfile() };
  } catch (error) {
    return {
      status: "failed",
      expired: isExpiredSessionError(error, "/users/me"),
      error,
    };
  }
}

export function clearLocalAuthSession(dispatch, clearContextUser, reason) {
  clearContextUser?.(reason);
  invalidateRefreshForDispatch(dispatch);
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  safeLocalStorageRemove(SESSION_KEY);
  if (safeLocalStorageGet(LEGACY_MIGRATION_KEY) !== "1") {
    // Remove legacy auth storage once; delete this migration after legacy builds age out.
    LEGACY_AUTH_STORAGE_KEYS.forEach(safeLocalStorageRemove);
    safeLocalStorageSet(LEGACY_MIGRATION_KEY, "1");
  }
}

export { getPersistedUserId, SESSION_KEY };
