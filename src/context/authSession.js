import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { clearCredentials } from "../features/auth/authSlice.js";
import { safeLocalStorageRemove, safeParseStorageJson } from "../utils/storage.js";

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
export function readPersistedSession() {
  const session = safeParseStorageJson(SESSION_KEY);
  return session?.accessToken ? session : null;
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
