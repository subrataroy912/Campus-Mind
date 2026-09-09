import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  getCurrentProfile as getCurrentProfileRequest,
  updateProfile as updateProfileRequest,
  logout as logoutRequest,
} from "../features/auth/api/authService";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import {
  clearCredentials,
  setCredentials,
} from "../features/auth/authSlice.js";
import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";

const AuthContext = createContext(null);
const SESSION_KEY = "campus-mind.session";
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
      const value = normalizeImageField(formData[formField]);
      const currentValue = normalizeImageField(
        currentUser?.[apiField] ?? currentUser?.[formField],
      );
      if (
        (apiField === "avatarUrl" || apiField === "bannerUrl") &&
        typeof value === "string" &&
        value.startsWith("data:")
      ) {
        return changes;
      }
      if (value !== currentValue || formField === "profileVisibility") {
        changes[apiField] = value;
      }
      return changes;
    },
    {},
  );
}

function resetApiCache(dispatch) {
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(SESSION_KEY, null);
  const dispatch = useDispatch();
  const userRef = useRef(user);
  const [authState, setAuthState] = useState({ status: "idle", error: null });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let ignore = false;

    async function validateSession() {
      const currentUser = userRef.current;
      const accessToken = currentUser?.accessToken;
      const refreshToken = currentUser?.refreshToken;

      if (!accessToken) {
        return;
      }

      try {
        setAuthState((current) => ({
          ...current,
          status: "checking",
          error: null,
        }));

        const profile = await getCurrentProfileRequest();
        if (ignore) return;

        const nextUser = {
          ...currentUser,
          ...profile,
          name: profile.displayName || currentUser?.name,
          avatar: profile.avatarUrl ?? currentUser?.avatar ?? null,
          banner: profile.bannerUrl ?? currentUser?.banner ?? null,
        };

        setUser(nextUser);
        dispatch(
          setCredentials({
            accessToken,
            refreshToken,
            user: nextUser,
          }),
        );
        setAuthState({ status: "succeeded", error: null });
      } catch (error) {
        if (ignore) return;

        const status =
          error?.status ?? error?.originalStatus ?? error?.response?.status;
        if (status === 401 || status === 404) {
          setUser(null);
          dispatch(clearCredentials());
          resetApiCache(dispatch);
          setAuthState({
            status: "failed",
            error: new Error("Your session has expired. Please log in again."),
          });
          return;
        }

        setAuthState({ status: "failed", error });
      }
    }

    validateSession();
    return () => {
      ignore = true;
    };
  }, [dispatch, setUser, user?.accessToken, user?.refreshToken]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
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
            "The social sign-in response was incomplete.",
          );
          setAuthState({ status: "failed", error });
          throw error;
        }

        const hydratedUser = nextUser
          ? {
              ...nextUser,
              accessToken,
              refreshToken,
              avatar: nextUser?.avatar ?? nextUser?.avatarUrl ?? null,
              banner: nextUser?.banner ?? nextUser?.bannerUrl ?? null,
              displayName: nextUser?.displayName ?? nextUser?.name,
            }
          : null;

        resetApiCache(dispatch);
        const profile = hydratedUser || (await getCurrentProfileRequest());
        const finalUser = {
          ...profile,
          accessToken,
          refreshToken,
          avatar: profile?.avatar ?? profile?.avatarUrl ?? null,
          banner: profile?.banner ?? profile?.bannerUrl ?? null,
          displayName: profile?.displayName ?? profile?.name,
        };

        setUser(finalUser);
        dispatch(setCredentials({ accessToken, refreshToken, user: finalUser }));
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
            accessToken,
            refreshToken,
            avatar: nextUser?.avatar ?? nextUser?.avatarUrl ?? null,
            banner: nextUser?.banner ?? nextUser?.bannerUrl ?? null,
            displayName: nextUser?.displayName ?? nextUser?.name,
          };
          resetApiCache(dispatch);
          setUser(hydratedUser);
          dispatch(
            setCredentials({ accessToken, refreshToken, user: hydratedUser }),
          );
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
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              avatar: result.user?.avatar ?? result.user?.avatarUrl ?? null,
              banner: result.user?.banner ?? result.user?.bannerUrl ?? null,
              displayName: result.user?.displayName ?? result.user?.name,
            };
            resetApiCache(dispatch);
            setUser(hydratedUser);
            dispatch(
              setCredentials({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                user: hydratedUser,
              }),
            );
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
        const nextProfile = await updateProfileRequest(profilePatch);
        const nextUser = {
          ...user,
          ...nextProfile,
          name: nextProfile.displayName || user?.name,
          avatar: nextProfile.avatarUrl ?? user?.avatar ?? null,
          banner: nextProfile.bannerUrl ?? user?.banner ?? null,
          bio: nextProfile.about || user?.bio,
          batchYear: nextProfile.gradeLevel || user?.batchYear,
        };
        setUser(nextUser);
        dispatch(
          setCredentials({
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken,
            user: nextUser,
          }),
        );
        const visibilityChanged = Object.prototype.hasOwnProperty.call(
          profilePatch,
          "profileVisibility",
        );
        triggerLifecycleRefresh(
          dispatch,
          visibilityChanged ? "user-profile-visibility-changed" : "user-profile-updated",
        );
        return nextProfile;
      },
      async hydrateProfile() {
        const profile = await getCurrentProfileRequest();
        const nextUser = {
          ...user,
          ...profile,
          name: profile.displayName || user?.name,
          avatar: profile.avatarUrl ?? user?.avatar ?? null,
          banner: profile.bannerUrl ?? user?.banner ?? null,
        };
        setUser(nextUser);
        dispatch(
          setCredentials({
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken,
            user: nextUser,
          }),
        );
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return profile;
      },
      async logout() {
        try {
          await logoutRequest(user?.refreshToken);
        } finally {
          setUser(null);
          dispatch(clearCredentials());
          resetApiCache(dispatch);
        }
      },
    }),
    [authState, dispatch, user, setUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
