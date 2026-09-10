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
export function clearAuthSession(dispatch, clearContextUser) {
  clearContextUser();
  dispatch(clearCredentials());
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  safeLocalStorageRemove("campus-mind.session");
  safeLocalStorageRemove("accessToken");
  safeLocalStorageRemove("refreshToken");
}
