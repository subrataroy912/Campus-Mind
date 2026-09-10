import { baseApi } from "@/app/baseApi.js";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentProfile: builder.query({
      query: () => "/users/me",
      providesTags: [{ type: "Profile", id: "CURRENT" }],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    getPublicProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
      ],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    updateCurrentProfile: builder.mutation({
      query: (changes) => {
        const { avatarFile, bannerFile, ...profile } = changes;
        if (!avatarFile && !bannerFile) {
          return { url: "/users/me", method: "PATCH", body: profile };
        }
        const body = new FormData();
        body.append(
          "profile",
          new Blob([JSON.stringify(profile)], { type: "application/json" })
        );
        if (avatarFile) body.append("avatarFile", avatarFile, avatarFile.name);
        if (bannerFile) body.append("bannerFile", bannerFile, bannerFile.name);
        return { url: "/users/me", method: "PATCH", body };
      },
      invalidatesTags: [
        { type: "Profile", id: "CURRENT" },
        { type: "Classrooms", id: "LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            profileApi.util.invalidateTags([
              { type: "Profile", id: "CURRENT" },
              { type: "Classrooms", id: "LIST" },
            ])
          );
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
