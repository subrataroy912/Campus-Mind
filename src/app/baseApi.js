import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "@/features/auth/authSlice.js";
import { safeParseStorageJson, safeLocalStorageSet } from "@/utils/storage.js";
import { clearLocalAuthSession, SESSION_KEY } from "@/context/authSession.js";

/** The API always exposes versioned routes; callers configure only its origin. */
export const apiBaseUrl = (() => {
  const configured = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
  ).replace(/\/+$/, "");
  return configured.endsWith("/v1") ? configured : `${configured}/v1`;
})();

const csrfCookieName = import.meta.env.VITE_CSRF_COOKIE_NAME || "XSRF-TOKEN";

function csrfToken() {
  if (typeof document === "undefined" || typeof document.cookie !== "string")
    return null;
  const prefix = `${encodeURIComponent(csrfCookieName)}=`;
  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return null;
  }
}

function prepareCookieHeaders(headers) {
  headers.set("accept", "application/json");
  const token = csrfToken();
  if (token) headers.set("x-csrf-token", token);
  return headers;
}

// Retained for callers which need to distinguish a missing current profile.
export function shouldForceLogout(endpoint, statusCode) {
  return (
    statusCode === 401 ||
    (statusCode === 404 && String(endpoint).includes("/users/me"))
  );
}

const PUBLIC_AUTH_ENDPOINTS = new Set(["login", "register", "refresh"]);
const UNAUTHENTICATED_ERROR = Object.freeze({
  status: 401,
  data: { error: "Unauthenticated" },
});

// This is intentionally module-scoped: separate RTK Query requests must share
// one refresh operation because refresh-token rotation invalidates the old token.
let refreshPromise = null;

function normalizeError(error) {
  const status = error?.status;
  if (typeof status === "number" && status >= 500) {
    return { ...error, data: { error: "Service unavailable" } };
  }
  if (typeof status !== "number") {
    return { ...error, data: { error: "Service unavailable" } };
  }
  const serverError = error?.data?.error;
  return {
    ...error,
    data: {
      error: typeof serverError === "string" ? serverError : "Request failed",
    },
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    prepareCookieHeaders(headers);
    if (!PUBLIC_AUTH_ENDPOINTS.has(endpoint)) {
      const token = getState().auth?.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Refresh is deliberately separate so it can never inherit a stale bearer token.
const publicBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: prepareCookieHeaders,
});

function unauthenticatedError() {
  return {
    status: UNAUTHENTICATED_ERROR.status,
    data: { ...UNAUTHENTICATED_ERROR.data },
  };
}

function validToken(value) {
  return typeof value === "string" && value.length > 0;
}

function persistRefreshedCredentials(credentials) {
  const persisted = safeParseStorageJson(SESSION_KEY, {});
  const session =
    persisted && typeof persisted === "object" && !Array.isArray(persisted)
      ? persisted
      : {};

  // Write the complete rotated pair before exposing it to Redux, so a reload
  // cannot observe a new access token paired with an old refresh token.
  safeLocalStorageSet(
    SESSION_KEY,
    JSON.stringify({ ...session, ...credentials })
  );
}

async function refreshCredentials(api, extraOptions) {
  const refreshToken = api.getState().auth?.refreshToken;
  if (!validToken(refreshToken)) {
    throw unauthenticatedError();
  }
  const refreshResult = await publicBaseQuery(
    { url: "/auth/refresh", method: "POST" },
    api,
    { ...extraOptions, skipAuthRefresh: true }
  );
  const refreshed = refreshResult.data?.data ?? refreshResult.data;
  if (
    refreshResult.error ||
    !validToken(refreshed?.accessToken)
  ) {
    throw unauthenticatedError();
  }

  const credentials = {
    accessToken: refreshed.accessToken,
    // Cookie-based refresh endpoints commonly rotate only the access token.
    // Preserve the existing refresh token unless the server sends a new one.
    refreshToken: validToken(refreshed.refreshToken)
      ? refreshed.refreshToken
      : refreshToken,
    user: api.getState().auth?.user ?? null,
  };
  persistRefreshedCredentials(credentials);
  api.dispatch(setCredentials(credentials));
  return credentials;
}

function getRefreshPromise(api, extraOptions) {
  if (refreshPromise) return refreshPromise;

  refreshPromise = refreshCredentials(api, extraOptions)
    .catch((error) => {
      // All waiters share this branch, which makes teardown and the returned
      // unauthenticated error deterministic even when many requests fail.
      clearLocalAuthSession(api.dispatch);
      throw error?.status === 401 ? error : unauthenticatedError();
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

/** Refresh a failed authenticated request once. Refresh itself can never recurse. */
export const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (
    result.error?.status !== 401 ||
    extraOptions?.skipAuthRefresh ||
    PUBLIC_AUTH_ENDPOINTS.has(api.endpoint)
  ) {
    return result.error ? { error: normalizeError(result.error) } : result;
  }

  try {
    await getRefreshPromise(api, extraOptions);
  } catch {
    return { error: unauthenticatedError() };
  }

  result = await rawBaseQuery(args, api, {
    ...extraOptions,
    skipAuthRefresh: true,
  });
  // A retry is deliberately final: a second 401 must not trigger another
  // refresh, otherwise an invalid access token can create a refresh loop.
  return result.error ? { error: normalizeError(result.error) } : result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "Classrooms",
    "Profile",
    "Notifications",
    "Coursework",
    "Attachments",
  ],
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({}),
});
