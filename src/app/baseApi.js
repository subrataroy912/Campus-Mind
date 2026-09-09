import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "@/features/auth/authSlice.js";
import { safeLocalStorageGet, safeLocalStorageRemove, safeParseStorageJson } from "@/utils/storage.js";
import { clearPersistedApiState } from "./apiCachePersistence.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/v1";

export function shouldForceLogout(endpoint, statusCode) {
  if (statusCode === 401) return true;

  if (statusCode !== 404) return false;

  const normalizedEndpoint = String(endpoint ?? "").toLowerCase();
  return (
    normalizedEndpoint.includes("/users/me") ||
    normalizedEndpoint.includes("/auth/me") ||
    normalizedEndpoint.includes("/profile")
  );
}

function clearAuthSession(api) {
  api.dispatch(clearCredentials());
  api.dispatch(baseApi.util.resetApiState());
  clearPersistedApiState();
  safeLocalStorageRemove("campus-mind.session");
  safeLocalStorageRemove("accessToken");
  safeLocalStorageRemove("refreshToken");
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token =
      getState().auth?.accessToken ||
      safeParseStorageJson("campus-mind.session")?.accessToken ||
      safeLocalStorageGet("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  const endpoint = typeof args === "string" ? args : args?.url || "";
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && shouldForceLogout(endpoint, result.error?.status)) {
    clearAuthSession(api);
    return result;
  }

  if (result.error?.status !== 401 || extraOptions?.skipAuthRefresh) return result;

  const refreshToken = api.getState().auth?.refreshToken;
  if (!refreshToken) {
    clearAuthSession(api);
    return result;
  }

  const refreshResult = await rawBaseQuery(
    { url: "/auth/refresh", method: "POST", body: { refreshToken } },
    api,
    { skipAuthRefresh: true },
  );
  const payload = refreshResult.data?.data ?? refreshResult.data;
  if (refreshResult.data && payload?.accessToken) {
    const nextCredentials = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? refreshToken,
      user: payload.user ?? api.getState().auth.user,
    };
    api.dispatch(setCredentials(nextCredentials));
    const session = safeParseStorageJson("campus-mind.session", null);
    const nextSession = { ...(session ?? {}), ...nextCredentials };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("campus-mind.session", JSON.stringify(nextSession));
      } catch {
        // Ignore storage failures during refresh handling.
      }
    }
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    clearAuthSession(api);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Classrooms", "Profile", "Notifications"],
  baseQuery: baseQueryWithRefresh,

  endpoints: () => ({}),
});
