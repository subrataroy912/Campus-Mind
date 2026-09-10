import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { clearCredentials, setSession } from "../features/auth/authSlice.js";
import { safeLocalStorageRemove, safeLocalStorageSet, safeParseStorageJson } from "../utils/storage.js";

/**
 * Removes every client-side trace of an authenticated session.
 *
 * This deliberately runs before the best-effort server logout request so a
 * slow or failed request can never keep the user signed in in the UI.
 */
export const SESSION_KEY = "campus-mind.session";
// These keys are never read for authentication; they are removed only to
// clean up sessions written by older versions of the application.
export const LEGACY_AUTH_STORAGE_KEYS = ["accessToken", "refreshToken"];

/**
 * The session record is the sole persisted source of credentials. Keeping the
 * validation here lets the provider complete its bootstrap before any route
 * or data hook can treat a user as authenticated.
 */
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function token(value) {
  return typeof value === "string" && value.trim() ? value : null;
}

/** Converts legacy token-bearing user records into the sole session contract. */
export function normalizeSession(record) {
  if (!isRecord(record)) return null;
  const source = isRecord(record.session) ? record.session : record;
  const accessToken = token(source.accessToken ?? source.token);
  if (!accessToken) return null;
  const nestedUser = isRecord(source.user) ? source.user : null;
  const { accessToken: _accessToken, refreshToken: _refreshToken, token: _token, session: _session, user: _user, ...flatProfile } = source;
  const user = nestedUser ?? flatProfile;
  return {
    accessToken,
    refreshToken: token(source.refreshToken ?? source.refresh_token),
    user: isRecord(user) && Object.keys(user).length ? user : null,
  };
}

/** Persists and publishes exactly the same canonical session object. */
export function commitAuthSession(dispatch, record) {
  const session = normalizeSession(record);
  if (!session) throw new Error("Cannot commit an invalid authenticated session.");
  safeLocalStorageSet(SESSION_KEY, JSON.stringify(session));
  dispatch(setSession(session));
  return session;
}

/** Applies a profile response without ever copying credentials from its caller. */
export function mergeProfileIntoCurrentSession(getState, profile) {
  if (typeof getState !== "function" || !isRecord(profile)) {
    throw new Error("Cannot merge an invalid profile response.");
  }
  const current = normalizeSession(getState()?.auth);
  if (!current) return null;
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
  // Migration is idempotent and removes legacy flat/nested representations.
  safeLocalStorageSet(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function isExpiredSessionError(error) {
  const status = error?.status ?? error?.originalStatus ?? error?.response?.status;
  return status === 401 || status === 404;
}

export function getProtectedRouteState(authStatus, isAuthenticated) {
  if (authStatus === "hydrating") return "hydrating";
  return isAuthenticated ? "authenticated" : "unauthenticated";
}

/**
 * Installs a canonical persisted session before validating it with the API.
 * Keeping this orchestration independent from React makes the cold-start
 * contract testable and prevents a route from observing half-hydrated auth.
 */
export async function hydratePersistedSession({ session, installCredentials, getProfile }) {
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

/**
 * Clears the local application state for the current authenticated user.
 *
 * `clearContextUser` is optional because non-React callers (for example an
 * expired RTK Query request) only need to reset the Redux and storage state.
 */
export function clearLocalAuthSession(dispatch, clearContextUser) {
  clearContextUser?.();
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  safeLocalStorageRemove(SESSION_KEY);
  LEGACY_AUTH_STORAGE_KEYS.forEach(safeLocalStorageRemove);
}
