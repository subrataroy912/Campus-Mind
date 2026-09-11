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
      async onQueryStarted(changes, { dispatch, queryFulfilled }) {
        const { avatarFile, bannerFile, ...profile } = changes;
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getCurrentProfile", undefined, (draft) => {
            Object.assign(draft, profile);
            if (avatarFile) draft.avatar = URL.createObjectURL(avatarFile);
            if (bannerFile) draft.bannerUrl = URL.createObjectURL(bannerFile);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
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
