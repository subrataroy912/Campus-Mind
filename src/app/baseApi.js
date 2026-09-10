import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "@/features/auth/authSlice.js";
import {
  safeParseStorageJson,
} from "@/utils/storage.js";
import { clearLocalAuthSession } from "@/context/authSession.js";

/** The API always exposes versioned routes; callers configure only its origin. */
export const apiBaseUrl = (() => {
  const configured = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
  ).replace(/\/+$/, "");
  return configured.endsWith("/v1") ? configured : `${configured}/v1`;
})();

// Retained for callers which need to distinguish a missing current profile.
export function shouldForceLogout(endpoint, statusCode) {
  return (
    statusCode === 401 ||
    (statusCode === 404 && String(endpoint).includes("/users/me"))
  );
}

const PUBLIC_AUTH_ENDPOINTS = new Set(["login", "register", "refresh"]);

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
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("accept", "application/json");
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
  prepareHeaders: (headers) => {
    headers.set("accept", "application/json");
    return headers;
  },
});

/** Refresh a failed authenticated request once. Refresh itself can never recurse. */
const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (
    result.error?.status !== 401 ||
    extraOptions?.skipAuthRefresh ||
    PUBLIC_AUTH_ENDPOINTS.has(api.endpoint)
  ) {
    return result.error ? { error: normalizeError(result.error) } : result;
  }

  const refreshToken = api.getState().auth?.refreshToken;
  if (!refreshToken) {
    clearLocalAuthSession(api.dispatch);
    return { error: normalizeError(result.error) };
  }

  const refreshResult = await publicBaseQuery(
    { url: "/auth/refresh", method: "POST", body: { refreshToken } },
    api,
    { ...extraOptions, skipAuthRefresh: true }
  );
  const refreshed = refreshResult.data;
  if (
    !refreshResult.error &&
    refreshed?.accessToken &&
    refreshed?.refreshToken
  ) {
    const credentials = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      user: api.getState().auth?.user,
    };
    api.dispatch(setCredentials(credentials));
    const session = safeParseStorageJson("campus-mind.session", {});
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "campus-mind.session",
          JSON.stringify({ ...session, ...credentials })
        );
      } catch {
        // A working in-memory session is still useful when storage is blocked.
      }
    }
    result = await rawBaseQuery(args, api, {
      ...extraOptions,
      skipAuthRefresh: true,
    });
    return result.error ? { error: normalizeError(result.error) } : result;
  }

  clearLocalAuthSession(api.dispatch);
  return { error: normalizeError(result.error) };
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
