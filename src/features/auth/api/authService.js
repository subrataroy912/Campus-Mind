import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";

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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/v1";
  const params = new URLSearchParams({
    mode,
    redirect_uri: `${window.location.origin}/auth/callback`,
  });
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

export async function updateProfile(userId, details) {
  return unwrapResponse(
    await store.dispatch(
      authApi.endpoints.updateProfile.initiate({ userId, details }),
    ).unwrap(),
  );
}

export async function deleteAccount(userId) {
  await store.dispatch(authApi.endpoints.deleteAccount.initiate(userId)).unwrap();
}
