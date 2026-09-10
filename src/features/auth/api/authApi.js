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
      // Use the current bearer token to revoke the active server session.
      // `skipAuthRefresh` keeps logout best-effort if that token has expired.
      extraOptions: { skipAuthRefresh: true },
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});
