import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, setSession } from "@/features/auth/authSlice.js";
import {
  clearLocalAuthSession,
  isExpiredSessionError,
} from "@/context/authSession.js";
import { registerRefreshInvalidator } from "./refreshState.js";

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

export function shouldForceLogout(endpoint, statusCode) {
  return isExpiredSessionError({ status: statusCode }, endpoint);
}

const PUBLIC_AUTH_ENDPOINTS = new Set(["login", "register", "refresh"]);
const PUBLIC_DISCOVERY_ENDPOINTS = new Set([
  "getExploreFeed",
  "searchExploreCourses",
]);
const UNAUTHENTICATED_ERROR = Object.freeze({
  status: 401,
  data: { error: "Unauthenticated" },
});

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
    if (
      !PUBLIC_AUTH_ENDPOINTS.has(endpoint) &&
      !PUBLIC_DISCOVERY_ENDPOINTS.has(endpoint)
    ) {
      const token = getState().auth?.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

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

async function refreshCredentials(api, extraOptions) {
  const refreshResult = await publicBaseQuery(
    { url: "/auth/refresh", method: "POST" },
    api,
    { ...extraOptions, skipAuthRefresh: true }
  );
  const refreshed = refreshResult.data?.data ?? refreshResult.data;

  if (refreshResult.error || !validToken(refreshed?.accessToken)) {
    throw unauthenticatedError();
  }

  const existingUser = api.getState().auth?.user ?? null;
  const nextAccessToken = refreshed.accessToken;
  api.dispatch(setAccessToken(nextAccessToken));
  if (existingUser) {
    api.dispatch(
      setSession({ accessToken: nextAccessToken, user: existingUser })
    );
  }
  return nextAccessToken;
}

export function createBaseQueryWithRefresh() {
  let refreshPromise = null;
  let refreshController = null;
  let refreshGeneration = 0;

  const invalidateRefresh = () => {
    refreshGeneration += 1;
    refreshController?.abort();
    refreshController = null;
    refreshPromise = null;
  };

  const getRefreshPromise = (api, extraOptions) => {
    if (refreshPromise) return refreshPromise;

    const generation = refreshGeneration;
    refreshController = new AbortController();
    refreshPromise = refreshCredentials(api, {
      ...extraOptions,
      signal: refreshController.signal,
    })
      .then((token) => {
        if (generation !== refreshGeneration) throw unauthenticatedError();
        return token;
      })
      .catch((error) => {
        clearLocalAuthSession(api.dispatch);
        throw error?.status === 401 ? error : unauthenticatedError();
      })
      .finally(() => {
        if (generation === refreshGeneration) {
          refreshController = null;
          refreshPromise = null;
        }
      });
    registerRefreshInvalidator(api.dispatch, invalidateRefresh);
    return refreshPromise;
  };

  return async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    if (
      result.error?.status !== 401 ||
      extraOptions?.skipAuthRefresh ||
      PUBLIC_AUTH_ENDPOINTS.has(api.endpoint) ||
      PUBLIC_DISCOVERY_ENDPOINTS.has(api.endpoint)
    ) {
      return result.error ? { error: normalizeError(result.error) } : result;
    }
    const accessToken = api.getState().auth?.accessToken;

    if (!validToken(accessToken) && api.endpoint !== "logout") {
      return { error: unauthenticatedError() };
    }
    const requestRefreshGeneration = refreshGeneration;
    try {
      await getRefreshPromise(api, extraOptions);
    } catch {
      return { error: unauthenticatedError() };
    }

    if (
      refreshGeneration !== requestRefreshGeneration &&
      !validToken(api.getState().auth?.accessToken)
    ) {
      return { error: unauthenticatedError() };
    }
    result = await rawBaseQuery(args, api, {
      ...extraOptions,
      skipAuthRefresh: true,
    });
    if (result.error?.status === 401) {
      clearLocalAuthSession(api.dispatch);
      return { error: normalizeError(result.error) };
    }
    return result.error ? { error: normalizeError(result.error) } : result;
  };
}

export const baseQueryWithRefresh = createBaseQueryWithRefresh();

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "Classrooms",
    "CourseFeed",
    "CourseSearch",
    "CourseRecommendations",
    "Profile",
    "Notifications",
    "Coursework",
    "Attachments",
  ],
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({}),
});
