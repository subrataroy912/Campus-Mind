import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { clearLocalAuthSession, setStoredSessionHint } from "@/context/authSession.js";

const unwrapResponse = (response) => response?.data ?? response;

import { safeLocalStorageSet } from "@/utils/storage.js";

export function normalizeAuthResponse(response) {
  const payload = unwrapResponse(response);
  const nestedUser = payload.user ?? {};
  const userFields = {
    ...nestedUser,
    id: payload.userId ?? nestedUser.id ?? payload.id ?? nestedUser.userId,
    name:
      payload.displayName ??
      nestedUser.name ??
      nestedUser.displayName ??
      payload.name ??
      nestedUser.fullName,
    email: payload.email ?? nestedUser.email,
    avatar: payload.avatarUrl ?? nestedUser.avatar ?? nestedUser.avatarUrl,
    banner: payload.bannerUrl ?? nestedUser.banner ?? nestedUser.bannerUrl,
    handle: payload.handle ?? nestedUser.handle,
    headline: payload.headline ?? nestedUser.headline,
    profileVisibility:
      payload.profileVisibility ?? nestedUser.profileVisibility,
    accountType: payload.accountType ?? nestedUser.accountType,
    canCreateCourses:
      payload.canCreateCourses ?? nestedUser.canCreateCourses,
    firstName: payload.firstName ?? nestedUser.firstName,
    lastName: payload.lastName ?? nestedUser.lastName,
    bio: payload.bio ?? nestedUser.bio ?? nestedUser.about,
    avatarUrl: payload.avatarUrl ?? nestedUser.avatarUrl ?? nestedUser.avatar,
    bannerUrl: payload.bannerUrl ?? nestedUser.bannerUrl ?? nestedUser.banner,
    role: payload.role ?? nestedUser.role,
  };

  Object.keys(userFields).forEach((key) => {
    if (userFields[key] === undefined) delete userFields[key];
  });
  const user = Object.keys(userFields).length ? userFields : null;

  const refreshToken = payload.refreshToken ?? null;
  if (refreshToken) {
    safeLocalStorageSet("campus-mind.refreshToken", refreshToken);
    setStoredSessionHint(true);
  }

  return {
    accessToken: payload.accessToken ?? payload.token ?? null,
    user,
  };
}

export function getOAuthRedirectUrl(provider) {
  const rawBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "https://m198-backend.onrender.com";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  return `${
    baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`
  }/auth/oauth/${provider}`;
}

export async function login(credentials) {
  return normalizeAuthResponse(
    await store.dispatch(authApi.endpoints.login.initiate(credentials)).unwrap()
  );
}

export async function register(details) {
  return normalizeAuthResponse(
    await store.dispatch(authApi.endpoints.register.initiate(details)).unwrap()
  );
}

export async function refresh() {
  return normalizeAuthResponse(
    await store.dispatch(authApi.endpoints.refresh.initiate()).unwrap()
  );
}

export async function getCurrentProfile() {
  return unwrapResponse(
    await store
      .dispatch(
        profileApi.endpoints.getCurrentProfile.initiate(undefined, {
          forceRefetch: true,
        })
      )
      .unwrap()
  );
}

export async function updateProfile(details) {
  return unwrapResponse(
    await store
      .dispatch(profileApi.endpoints.updateCurrentProfile.initiate(details))
      .unwrap()
  );
}

export async function unlockCreator() {
  return unwrapResponse(
    await store.dispatch(profileApi.endpoints.unlockCreator.initiate()).unwrap()
  );
}

export async function logout({ onLocalTeardown } = {}) {
  try {
    // Keep Redux credentials installed until the request is created so the
    // interceptor can send its bearer token. Clearing them first made logout
    // requests anonymous and left server-side sessions alive.
    await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  } catch {
    // Revocation is best-effort; local cleanup still happens below.
  } finally {
    clearLocalAuthSession(store.dispatch, onLocalTeardown);
  }
}
