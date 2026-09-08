import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "@/features/auth/authSlice.js";
import { clearPersistedApiState } from "./apiCachePersistence.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401 || extraOptions?.skipAuthRefresh) return result;

  const refreshToken = api.getState().auth?.refreshToken;
  if (!refreshToken) {
    api.dispatch(clearCredentials());
    api.dispatch(baseApi.util.resetApiState());
    clearPersistedApiState();
    window.localStorage.removeItem("campus-mind.session");
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
    const session = JSON.parse(window.localStorage.getItem("campus-mind.session") || "null");
    window.localStorage.setItem("campus-mind.session", JSON.stringify({ ...session, ...nextCredentials }));
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    api.dispatch(clearCredentials());
    api.dispatch(baseApi.util.resetApiState());
    clearPersistedApiState();
    window.localStorage.removeItem("campus-mind.session");
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Classrooms", "Profile"],
  baseQuery: baseQueryWithRefresh,

  endpoints: () => ({}),
});
