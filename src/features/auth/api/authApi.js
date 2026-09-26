import { baseApi } from "@/app/baseApi.js";
import { safeLocalStorageGet } from "@/utils/storage.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (details) => ({
        url: "/auth/register",
        method: "POST",
        body: details,
      }),
    }),
    refresh: builder.mutation({
      query: () => {
        const refreshToken = safeLocalStorageGet("campus-mind.refreshToken");
        return {
          url: "/auth/refresh",
          method: "POST",
          body: refreshToken ? { refreshToken } : undefined,
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        const refreshToken = safeLocalStorageGet("campus-mind.refreshToken");
        return {
          url: "/auth/logout",
          method: "POST",
          body: refreshToken ? { refreshToken } : undefined,
        };
      },
    }),
    completeOnboarding: builder.mutation({
      query: (profileData) => ({
        url: "/auth/onboarding/complete",
        method: "POST",
        body: profileData,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
    cancelOnboarding: builder.mutation({
      query: () => ({
        url: "/auth/onboarding/cancel",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
  }),
});
