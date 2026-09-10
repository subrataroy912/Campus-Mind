import { baseApi } from "@/app/baseApi.js";

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
    logout: builder.mutation({
      extraOptions: { skipAuthRefresh: true },
      query: (refreshToken) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});
