import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function normalizeAuthResponse(response) {
  const payload = unwrapResponse(response);
  const nestedUser = payload.user ?? {};
  const user = {
    ...nestedUser,
    id: payload.userId ?? nestedUser.id,
    name: payload.displayName ?? nestedUser.name,
    email: payload.email ?? nestedUser.email,
    avatar: payload.avatarUrl ?? nestedUser.avatar,
  };

  return {
    accessToken: payload.accessToken ?? payload.token,
    refreshToken: payload.refreshToken ?? null,
    user,
  };
}

export function getOAuthRedirectUrl(provider, mode) {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/v1";
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
    await store.dispatch(authApi.endpoints.login.initiate(credentials)).unwrap(),
  );
}

export async function register(details) {
  return normalizeAuthResponse(
    await store.dispatch(authApi.endpoints.register.initiate(details)).unwrap(),
  );
}

export async function getCurrentProfile() {
  return unwrapResponse(
    await store.dispatch(profileApi.endpoints.getCurrentProfile.initiate()).unwrap(),
  );
}

export async function updateProfile(details) {
  return unwrapResponse(
    await store.dispatch(
      profileApi.endpoints.updateCurrentProfile.initiate(details),
    ).unwrap(),
  );
}

export async function deleteAccount(userId) {
  await store.dispatch(authApi.endpoints.deleteAccount.initiate(userId)).unwrap();
}
