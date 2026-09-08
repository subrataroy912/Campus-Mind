import { baseApi } from "@/app/baseApi.js";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["Profile"],
    }),
    getPublicProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }],
    }),
    updateCurrentProfile: builder.mutation({
      query: (changes) => ({ url: "/users/me", method: "PATCH", body: changes }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetCurrentProfileQuery,
  useGetPublicProfileQuery,
  useUpdateCurrentProfileMutation,
} = profileApi;