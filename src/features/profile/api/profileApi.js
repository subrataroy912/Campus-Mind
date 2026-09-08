import { baseApi } from "@/app/baseApi.js";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["Profile"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    getPublicProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "Profile", id: userId }],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
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