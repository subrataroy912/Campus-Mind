import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { clearCredentials } from "../features/auth/authSlice.js";
import { safeLocalStorageRemove } from "../utils/storage.js";

/**
 * Removes every client-side trace of an authenticated session.
 *
 * This deliberately runs before the best-effort server logout request so a
 * slow or failed request can never keep the user signed in in the UI.
 */
export const LEGACY_AUTH_STORAGE_KEYS = ["accessToken", "refreshToken"];

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
  safeLocalStorageRemove("campus-mind.session");
  LEGACY_AUTH_STORAGE_KEYS.forEach(safeLocalStorageRemove);
}
