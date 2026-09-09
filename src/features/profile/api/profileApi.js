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
      invalidatesTags: ["Profile", "Classrooms"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(profileApi.util.invalidateTags(["Profile", "Classrooms"]));
        } catch {
          // The profile mutation will surface the request error to the caller.
        }
      },
    }),
  }),
});

export const {
  useGetCurrentProfileQuery,
  useGetPublicProfileQuery,
  useUpdateCurrentProfileMutation,
} = profileApi;