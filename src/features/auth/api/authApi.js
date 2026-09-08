import { baseApi } from "@/app/baseApi.js";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: "/auth/login", method: "POST", body: credentials }),
    }),
    register: builder.mutation({
      query: (details) => ({ url: "/auth/register", method: "POST", body: details }),
    }),
    updateProfile: builder.mutation({
      query: ({ userId, details }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: details,
      }),
    }),
    deleteAccount: builder.mutation({
      query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
    }),
  }),
});