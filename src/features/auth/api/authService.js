import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function normalizeAuthResponse(response) {
  const payload = unwrapResponse(response);
  const nestedUser = payload.user ?? {};
  const user = {
    ...nestedUser,
    id: payload.userId ?? nestedUser.id ?? payload.id ?? nestedUser.userId,
    name:
      payload.displayName ??
      nestedUser.name ??
      nestedUser.displayName ??
      payload.name ??
      nestedUser.fullName ??
      "CampusMind member",
    email: payload.email ?? nestedUser.email,
    avatar: payload.avatarUrl ?? nestedUser.avatar ?? nestedUser.avatarUrl,
    banner: payload.bannerUrl ?? nestedUser.banner ?? nestedUser.bannerUrl,
    handle: payload.handle ?? nestedUser.handle,
    headline: payload.headline ?? nestedUser.headline,
    profileVisibility: payload.profileVisibility ?? nestedUser.profileVisibility,
    accountType: payload.accountType ?? nestedUser.accountType,
    firstName: payload.firstName ?? nestedUser.firstName,
    lastName: payload.lastName ?? nestedUser.lastName,
    bio: payload.bio ?? nestedUser.bio ?? nestedUser.about,
    avatarUrl: payload.avatarUrl ?? nestedUser.avatarUrl ?? nestedUser.avatar,
    bannerUrl: payload.bannerUrl ?? nestedUser.bannerUrl ?? nestedUser.banner,
    role: payload.role ?? nestedUser.role,
  };

  Object.keys(user).forEach((key) => {
    if (user[key] === undefined) delete user[key];
  });

  return {
    accessToken: payload.accessToken ?? payload.token ?? null,
    refreshToken: payload.refreshToken ?? payload.refresh_token ?? null,
    user,
  };
}

export function getOAuthRedirectUrl(provider, mode) {
  void mode;
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  return `${baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`}/auth/oauth/${provider}`;
}

export async function login(credentials) {
  return normalizeAuthResponse(
    await store
      .dispatch(authApi.endpoints.login.initiate(credentials))
      .unwrap(),
  );
}

export async function register(details) {
  return normalizeAuthResponse(
    await store.dispatch(authApi.endpoints.register.initiate(details)).unwrap(),
  );
}

export async function getCurrentProfile() {
  return unwrapResponse(
    await store
      .dispatch(profileApi.endpoints.getCurrentProfile.initiate())
      .unwrap(),
  );
}

export async function updateProfile(details) {
  return unwrapResponse(
    await store
      .dispatch(profileApi.endpoints.updateCurrentProfile.initiate(details))
      .unwrap(),
  );
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  await store
    .dispatch(authApi.endpoints.logout.initiate(refreshToken))
    .unwrap();
}
