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
  const rawBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/v1";
  const baseUrl = rawBaseUrl.replace(/\/+$/, ""); // Strip trailing slashes

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams({
    redirect_uri: `${origin}/auth/callback`,
  });

  if (mode !== undefined && mode !== null) {
    params.append("mode", mode);
  }

  return `${baseUrl}/auth/oauth/${provider}?${params.toString()}`;
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
