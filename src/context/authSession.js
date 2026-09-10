import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { clearCredentials, setSession } from "../features/auth/authSlice.js";
import {
  safeLocalStorageRemove,
  safeLocalStorageSet,
  safeParseStorageJson,
} from "../utils/storage.js";


export const SESSION_KEY = "campus-mind.session";
export const LEGACY_AUTH_STORAGE_KEYS = ["accessToken", "refreshToken"];

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
    refreshToken: _refreshToken,
    token: _token,
    session: _session,
    user: _user,
    ...flatProfile
  } = source;
  const user = nestedUser ?? flatProfile;
  return {
    accessToken,
    refreshToken: token(source.refreshToken ?? source.refresh_token),
    user: isRecord(user) && Object.keys(user).length ? user : null,
  };
}

export function commitAuthSession(dispatch, record) {
  const session = normalizeSession(record);
  if (!session)
    throw new Error("Cannot commit an invalid authenticated session.");
  safeLocalStorageSet(SESSION_KEY, JSON.stringify(session));
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

export function readPersistedSession() {
  const session = normalizeSession(safeParseStorageJson(SESSION_KEY));
  if (!session) return null;
  safeLocalStorageSet(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function isExpiredSessionError(error) {
  const status =
    error?.status ?? error?.originalStatus ?? error?.response?.status;
  return status === 401 || status === 404;
}

export function getProtectedRouteState(authStatus, isAuthenticated) {
  if (authStatus === "hydrating") return "hydrating";
  return isAuthenticated ? "authenticated" : "unauthenticated";
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
      expired: isExpiredSessionError(error),
      error,
    };
  }
}

export function clearLocalAuthSession(dispatch, clearContextUser) {
  clearContextUser?.();
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  safeLocalStorageRemove(SESSION_KEY);
  LEGACY_AUTH_STORAGE_KEYS.forEach(safeLocalStorageRemove);
}

export function synchronizeExternalSession(dispatch, sessionRecord) {
  const session = normalizeSession(sessionRecord);
  if (!session) {
    clearLocalAuthSession(dispatch);
    return null;
  }
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  return commitAuthSession(dispatch, session);
}
