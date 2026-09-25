import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMatches } from "react-router";
import {
  login as loginRequest,
  register as registerRequest,
  refresh as refreshRequest,
  getCurrentProfile as getCurrentProfileRequest,
  updateProfile as updateProfileRequest,
  uploadAvatar as uploadAvatarRequest,
  deleteAvatar as deleteAvatarRequest,
  uploadBanner as uploadBannerRequest,
  deleteBanner as deleteBannerRequest,
  updateCreatorProfile as updateCreatorProfileRequest,
  deleteAccount as deleteAccountRequest,
  unlockCreator as unlockCreatorRequest,
  logout as logoutRequest,
} from "../features/auth/api/authService";
import { useDispatch, useSelector, useStore } from "react-redux";
import { baseApi } from "../app/baseApi.js";
import { clearPersistedApiState } from "../app/apiCachePersistence.js";
import { triggerLifecycleRefresh } from "@/app/refreshEvents.js";
import {
  commitAuthSession,
  mergeProfileIntoCurrentSession,
  clearLocalAuthSession,
  shouldAttemptSessionRestore,
} from "./authSession.js";
import {
  getHydrationFailureError,
  getProfileUpdateLifecycleEvent,
  toProfilePatch,
} from "./authContextUtils.js";
import {
  selectAccessToken,
  selectCurrentUser,
} from "../features/auth/authSelectors.js";
import { usePresenceHeartbeat } from "@/features/presence/usePresenceHeartbeat.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resetApiCache(dispatch) {
  dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
}

export function AuthProvider({ children }) {
  usePresenceHeartbeat();
  const dispatch = useDispatch();
  const store = useStore();
  const matches = useMatches();
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const requiresSessionRestore = shouldAttemptSessionRestore(matches);
  const userRef = useRef(user);
  const explicitTeardownErrorRef = useRef(null);
  const [authState, setAuthState] = useState(() => ({
    status: requiresSessionRestore && !accessToken ? "hydrating" : "succeeded",
    error: null,
  }));

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(
    () =>
      store.subscribe(() => {
        if (store.getState().auth.accessToken || !userRef.current) return;
        userRef.current = null;
        if (explicitTeardownErrorRef.current) return;
        setAuthState({
          status: "failed",
          error: new Error("Your session has expired. Please log in again."),
        });
      }),
    [store],
  );

  useEffect(() => {
    let ignore = false;
    const hasAccessToken = Boolean(accessToken);
    if (!requiresSessionRestore || hasAccessToken) {
      setAuthState((current) =>
        current.status === "succeeded" && current.error === null
          ? current
          : { status: "succeeded", error: null },
      );
      return () => {
        ignore = true;
      };
    }

    setAuthState({ status: "hydrating", error: null });

    async function bootstrapSession() {
      try {
        const refreshed = await refreshRequest();
        if (ignore) return;
        const accessToken = refreshed.accessToken;

        if (!accessToken) {
          throw new Error("Refresh failed");
        }

        commitAuthSession(dispatch, {
          accessToken,
          user: refreshed.user ?? userRef.current,
        });

        const profile = await getCurrentProfileRequest();
        if (ignore) return;
        if (!isRecord(profile)) {
          throw new Error(
            "Your profile could not be loaded. Please sign in again.",
          );
        }

        const nextSession = mergeProfileIntoCurrentSession(
          store.getState,
          profile,
        );
        if (!nextSession) return;
        commitAuthSession(dispatch, nextSession);
        setAuthState({ status: "succeeded", error: null });
      } catch (error) {
        if (ignore) return;

        const status =
          error?.status ?? error?.originalStatus ?? error?.response?.status;
        const isUnauthenticated = status === 400 || status === 401;
        const hydrationError = isUnauthenticated
          ? null
          : getHydrationFailureError(error);

        explicitTeardownErrorRef.current = hydrationError;
        clearLocalAuthSession(
          dispatch,
          (reason) => {
            explicitTeardownErrorRef.current = reason;
          },
          explicitTeardownErrorRef.current,
        );

        if (isUnauthenticated) {
          setAuthState({ status: "succeeded", error: null });
        } else {
          setAuthState({
            status: "failed",
            error: hydrationError,
          });
        }
        explicitTeardownErrorRef.current = null;
      }
    }

    bootstrapSession();
    return () => {
      ignore = true;
    };
  }, [accessToken, dispatch, requiresSessionRestore, store]);

  const value = useMemo(
    () => ({
      user,
      // A persisted user is only authenticated after its profile has been
      // validated and its credentials are installed in Redux.
      isAuthenticated: authState.status === "succeeded" && Boolean(accessToken),
      authStatus: authState.status,
      authError: authState.error,
      clearAuthError() {
        setAuthState((current) => ({ ...current, error: null }));
      },
      async completeOAuth({ accessToken, user: nextUser, errorMessage }) {
        if (errorMessage) {
          // Install the provider-issued token before requesting /users/me. Without
          // this, the profile request is sent without Authorization on a new OAuth
          // session and the callback can never complete.
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
        const provisionalUser = hydratedUser ?? null;
        commitAuthSession(dispatch, {
          accessToken,
          user: provisionalUser,
        });

        let profile;
        try {
          profile = await getCurrentProfileRequest();
        } catch (error) {
          clearLocalAuthSession(dispatch);
          throw error;
        }

        if (!isRecord(profile)) {
          clearLocalAuthSession(dispatch);
          const error = new Error(
            "The social sign-in response did not include a valid profile.",
          );
          setAuthState({ status: "failed", error });
          throw error;
        }

        const finalUser = {
          ...profile,
          avatar: profile?.avatar ?? profile?.avatarUrl ?? null,
          banner: profile?.banner ?? profile?.bannerUrl ?? null,
          displayName: profile?.displayName ?? profile?.name,
        };

        commitAuthSession(dispatch, {
          accessToken,
          user: finalUser,
        });
        triggerLifecycleRefresh(dispatch, "user-oauth-linked");
        setAuthState({ status: "succeeded", error: null });
        return finalUser;
      },
      async login(credentials) {
        setAuthState({ status: "loading", error: null });
        try {
          const { rememberMe: _rememberMe, ...loginCredentials } = credentials;
          const response = await loginRequest(loginCredentials);
          const { accessToken, user: nextUser } = response;
          let profile = null;
          try {
            profile = await getCurrentProfileRequest();
          } catch {
            // Profile fetch is optional fallback
          }
          const hydratedUser = {
            ...nextUser,
            ...(profile || {}),
            avatar:
              profile?.avatarUrl ??
              nextUser?.avatar ??
              nextUser?.avatarUrl ??
              null,
            banner:
              profile?.bannerUrl ??
              nextUser?.banner ??
              nextUser?.bannerUrl ??
              null,
            displayName:
              profile?.displayName ?? nextUser?.displayName ?? nextUser?.name,
            canCreateCourses: Boolean(
              profile?.canCreateCourses ?? nextUser?.canCreateCourses,
            ),
            isAdmin: Boolean(profile?.isAdmin ?? nextUser?.isAdmin),
          };
          resetApiCache(dispatch);
          commitAuthSession(dispatch, {
            accessToken,
            user: hydratedUser,
          });
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
            let profile = null;
            try {
              profile = await getCurrentProfileRequest();
            } catch {
              // optional fallback
            }
            const hydratedUser = {
              ...result.user,
              ...(profile || {}),
              avatar:
                profile?.avatarUrl ??
                result.user?.avatar ??
                result.user?.avatarUrl ??
                null,
              banner:
                profile?.bannerUrl ??
                result.user?.banner ??
                result.user?.bannerUrl ??
                null,
              displayName:
                profile?.displayName ??
                result.user?.displayName ??
                result.user?.name,
              canCreateCourses: Boolean(
                profile?.canCreateCourses ?? result.user?.canCreateCourses,
              ),
              isAdmin: Boolean(profile?.isAdmin ?? result.user?.isAdmin),
              isNewUser: Boolean(result.user?.isNewUser ?? true),
              profileCompleted: Boolean(
                profile?.profileCompleted ??
                result.user?.profileCompleted ??
                false,
              ),
            };
            resetApiCache(dispatch);
            commitAuthSession(dispatch, {
              accessToken: result.accessToken,
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
        const { avatarFile, bannerFile, ...textDetails } = details || {};
        const profilePatch = toProfilePatch(textDetails, user);
        let nextProfile = null;

        if (Object.keys(profilePatch).length > 0 || (!avatarFile && !bannerFile)) {
          nextProfile = await updateProfileRequest(profilePatch);
        }

        if (avatarFile) {
          const avatarRes = await uploadAvatarRequest(avatarFile);
          if (avatarRes?.avatarUrl) {
            nextProfile = { ...(nextProfile || user), avatarUrl: avatarRes.avatarUrl };
          }
        }

        if (bannerFile) {
          const bannerRes = await uploadBannerRequest(bannerFile);
          if (bannerRes?.bannerUrl) {
            nextProfile = { ...(nextProfile || user), bannerUrl: bannerRes.bannerUrl };
          }
        }

        const effectiveProfile = nextProfile || user;
        const nextUser = {
          ...user,
          ...effectiveProfile,
          name: effectiveProfile.displayName || user?.name,
          avatar: effectiveProfile.avatarUrl ?? user?.avatar ?? null,
          banner: effectiveProfile.bannerUrl ?? user?.banner ?? null,
          bio: effectiveProfile.about || user?.bio,
          phone: effectiveProfile.phone || user?.phone,
          gender: effectiveProfile.gender || user?.gender,
          dateOfBirth: effectiveProfile.dateOfBirth || user?.dateOfBirth,
          address: effectiveProfile.address || user?.address,
          profileCompleted: true,
          isNewUser: false,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(
          dispatch,
          getProfileUpdateLifecycleEvent(profilePatch),
        );
        return effectiveProfile;
      },
      async uploadAvatar(file) {
        const result = await uploadAvatarRequest(file);
        const newAvatarUrl = result?.avatarUrl || null;
        const nextUser = {
          ...user,
          avatar: newAvatarUrl,
          avatarUrl: newAvatarUrl,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return result;
      },
      async deleteAvatar() {
        const result = await deleteAvatarRequest();
        const nextUser = {
          ...user,
          avatar: null,
          avatarUrl: null,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return result;
      },
      async uploadBanner(file) {
        const result = await uploadBannerRequest(file);
        const newBannerUrl = result?.bannerUrl || null;
        const nextUser = {
          ...user,
          banner: newBannerUrl,
          bannerUrl: newBannerUrl,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return result;
      },
      async deleteBanner() {
        const result = await deleteBannerRequest();
        const nextUser = {
          ...user,
          banner: null,
          bannerUrl: null,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return result;
      },
      async updateCreatorProfile(data) {
        const nextProfile = await updateCreatorProfileRequest(data);
        const nextUser = {
          ...user,
          ...nextProfile,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return nextProfile;
      },
      async deleteAccount() {
        await deleteAccountRequest();
        clearLocalAuthSession(dispatch);
      },
      async unlockCreator() {
        const nextProfile = await unlockCreatorRequest();
        const nextUser = {
          ...user,
          ...nextProfile,
          canCreateCourses: true,
        };
        commitAuthSession(dispatch, {
          ...store.getState().auth,
          user: nextUser,
        });
        triggerLifecycleRefresh(dispatch, "user-profile-updated");
        return nextProfile;
      },
      async hydrateProfile() {
        const profile = await getCurrentProfileRequest();
        if (!isRecord(profile)) {
          throw new Error("The authenticated profile was invalid or missing.");
        }
        // This request can trigger a token refresh. Merge into the latest
        // session so neither the access nor refresh token can be reverted.
        const nextSession = mergeProfileIntoCurrentSession(
          store.getState,
          profile,
        );
        if (!nextSession)
          throw new Error("The authenticated session was cleared.");
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
    [authState, dispatch, accessToken, store, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
