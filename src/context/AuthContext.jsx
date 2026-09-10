import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getCurrentProfile as getCurrentProfileRequest,
  updateProfile as updateProfileRequest,
  logout as logoutRequest,
} from "../features/auth/api/authService";
import { useDispatch, useSelector, useStore } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice.js";
import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import {
  hydratePersistedSession,
  readPersistedSession,
  commitAuthSession,
  mergeProfileIntoCurrentSession,
} from "./authSession.js";

const AuthContext = createContext(null);
const PROFILE_FIELDS = {
  name: "displayName",
  firstName: "firstName",
  lastName: "lastName",
  handle: "handle",
  headline: "headline",
  bio: "about",
  avatar: "avatarUrl",
  banner: "bannerUrl",
  city: "city",
  country: "country",
  batchYear: "gradeLevel",
  profileVisibility: "profileVisibility",
};

function normalizeImageField(value) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toProfilePatch(formData, currentUser) {
  return Object.entries(PROFILE_FIELDS).reduce(
    (changes, [formField, apiField]) => {
      if (
        (formField === "avatar" && formData.avatarFile) ||
        (formField === "banner" && formData.bannerFile)
      ) {
        return changes;
      }
      const value = normalizeImageField(formData[formField]);
      const currentValue = normalizeImageField(
        currentUser?.[apiField] ?? currentUser?.[formField]
      );
      if (value !== currentValue || formField === "profileVisibility") {
        changes[apiField] = value;
      }
      return changes;
    },
    {}
  );
}

function resetApiCache(dispatch) {
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
}

export function AuthProvider({ children }) {
  const persistedSession = useMemo(() => readPersistedSession(), []);
  const dispatch = useDispatch();
  const store = useStore();
  const session = useSelector((state) => state.auth);
  const user = session.user;
  const userRef = useRef(user);
  const [authState, setAuthState] = useState({
    status: "hydrating",
    error: null,
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let ignore = false;

    async function validateSession() {
      const currentSession = persistedSession;
      const result = await hydratePersistedSession({
        session: currentSession,
        // Install credentials before the profile validation request. RTK Query
        // must never read a token directly from storage while hydration runs.
        installCredentials: (nextSession) => commitAuthSession(dispatch, nextSession),
        getProfile: getCurrentProfileRequest,
      });

      if (result.status === "failed") {
        if (ignore) return;
        if (result.expired) {
          dispatch(clearCredentials());
          resetApiCache(dispatch);
          setAuthState({
            status: "failed",
            error: new Error("Your session has expired. Please log in again."),
          });
        } else {
          setAuthState({ status: "failed", error: result.error });
        }
        return;
      }

      if (!result.user) {
        setAuthState({ status: "succeeded", error: null });
        return;
      }

      try {
        const profile = result.profile;
        // A logout can happen while this request is in flight. Do not let its
        // response recreate the session after client-side cleanup.
        if (ignore) return;
        const nextSession = mergeProfileIntoCurrentSession(store.getState, profile);
        if (!nextSession) return;
        commitAuthSession(dispatch, nextSession);
        setAuthState({ status: "succeeded", error: null });
      } catch (error) {
        if (ignore) return;
        setAuthState({ status: "failed", error });
      }
    }

    validateSession();
    return () => {
      ignore = true;
    };
  }, [dispatch, persistedSession, store]);

  const value = useMemo(
    () => ({
      user,
      // A persisted user is only authenticated after its profile has been
      // validated and its credentials are installed in Redux.
      isAuthenticated: authState.status === "succeeded" && Boolean(session.accessToken),
      authStatus: authState.status,
      authError: authState.error,
      clearAuthError() {
        setAuthState((current) => ({ ...current, error: null }));
      },
      async completeOAuth({
        accessToken,
        refreshToken,
        user: nextUser,
        errorMessage,
      }) {
        if (errorMessage) {
          const error = new Error(errorMessage);
          setAuthState({ status: "failed", error });
          throw error;
        }
        if (!accessToken) {
          const error = new Error(
            "The social sign-in response was incomplete."
          );
          setAuthState({ status: "failed", error });
          throw error;
        }

        setAuthState({ status: "loading", error: null });

        const hydratedUser = nextUser
          ? {
              ...nextUser,
              avatar: nextUser?.avatar ?? nextUser?.avatarUrl ?? null,
              banner: nextUser?.banner ?? nextUser?.bannerUrl ?? null,
              displayName: nextUser?.displayName ?? nextUser?.name,
            }
          : null;

        resetApiCache(dispatch);
        // Install the provider-issued token before requesting /users/me. Without
        // this, the profile request is sent without Authorization on a new OAuth
        // session and the callback can never complete.
        const provisionalUser = hydratedUser ?? null;
        commitAuthSession(dispatch, { accessToken, refreshToken, user: provisionalUser });

        let profile;
        try {
          profile = hydratedUser || (await getCurrentProfileRequest());
        } catch (error) {
          dispatch(clearCredentials());
          resetApiCache(dispatch);
          throw error;
        }
        const finalUser = {
          ...profile,
          avatar: profile?.avatar ?? profile?.avatarUrl ?? null,
          banner: profile?.banner ?? profile?.bannerUrl ?? null,
          displayName: profile?.displayName ?? profile?.name,
        };

        commitAuthSession(dispatch, { accessToken, refreshToken, user: finalUser });
        triggerLifecycleRefresh(dispatch, "user-oauth-linked");
        setAuthState({ status: "succeeded", error: null });
        return finalUser;
      },
      async login(credentials) {
        setAuthState({ status: "loading", error: null });
        try {
          const { rememberMe: _rememberMe, ...loginCredentials } = credentials;
          const response = await loginRequest(loginCredentials);
          const { accessToken, refreshToken, user: nextUser } = response;
          const hydratedUser = {
            ...nextUser,
            avatar: nextUser?.avatar ?? nextUser?.avatarUrl ?? null,
            banner: nextUser?.banner ?? nextUser?.bannerUrl ?? null,
            displayName: nextUser?.displayName ?? nextUser?.name,
          };
          resetApiCache(dispatch);
          commitAuthSession(dispatch, { accessToken, refreshToken, user: hydratedUser });
          setAuthState({ status: "succeeded", error: null });
          return hydratedUser;
        } catch (error) {
          setAuthState({ status: "failed", error });
          throw error;
        }
      },
      async register(details) {
        setAuthState({ status: "loading", error: null });
        try {
          const result = await registerRequest(details);
          if (result.accessToken && result.user) {
            const hydratedUser = {
              ...result.user,
              avatar: result.user?.avatar ?? result.user?.avatarUrl ?? null,
              banner: result.user?.banner ?? result.user?.bannerUrl ?? null,
              displayName: result.user?.displayName ?? result.user?.name,
            };
            resetApiCache(dispatch);
            commitAuthSession(dispatch, {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              user: hydratedUser,
            });
          }
          triggerLifecycleRefresh(dispatch, "user-registered");
          setAuthState({ status: "succeeded", error: null });
          return result;
        } catch (error) {
          setAuthState({ status: "failed", error });
          throw error;
        }
      },
      async updateProfile(details) {
        const profilePatch = toProfilePatch(details, user);
        const nextProfile = await updateProfileRequest({
          ...profilePatch,
          avatarFile: details.avatarFile,
          bannerFile: details.bannerFile,
        });
        const nextUser = {
          ...user,
          ...nextProfile,
          name: nextProfile.displayName || user?.name,
          avatar: nextProfile.avatarUrl ?? user?.avatar ?? null,
          banner: nextProfile.bannerUrl ?? user?.banner ?? null,
          bio: nextProfile.about || user?.bio,
          batchYear: nextProfile.gradeLevel || user?.batchYear,
        };
        commitAuthSession(dispatch, { ...store.getState().auth, user: nextUser });
        const visibilityChanged = Object.prototype.hasOwnProperty.call(
          profilePatch,
          "profileVisibility"
        );
        triggerLifecycleRefresh(
          dispatch,
          visibilityChanged
            ? "user-profile-visibility-changed"
            : "user-profile-updated"
        );
        return nextProfile;
      },
      async hydrateProfile() {
        const profile = await getCurrentProfileRequest();
        // This request can trigger a token refresh. Merge into the latest
        // session so neither the access nor refresh token can be reverted.
        const nextSession = mergeProfileIntoCurrentSession(store.getState, profile);
        if (!nextSession) throw new Error("The authenticated session was cleared.");
        commitAuthSession(dispatch, nextSession);
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return profile;
      },
      async logout() {
        await logoutRequest({
          onLocalTeardown() {
            userRef.current = null;
          },
        });
      },
    }),
    [authState, dispatch, session.accessToken, store, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
