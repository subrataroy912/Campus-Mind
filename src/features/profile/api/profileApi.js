import { baseApi } from "@/app/baseApi.js";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentProfile: builder.query({
      query: () => "/users/me",
      providesTags: [{ type: "Profile", id: "CURRENT" }],
      keepUnusedDataFor: 300,
    }),

    getPublicProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "Profile", id: userId },
      ],
      keepUnusedDataFor: 300,
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
          new Blob([JSON.stringify(profile)], { type: "application/json" }),
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
        const tempUrls = []; // Array to track local URLs for cleanup

        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              Object.assign(draft, profile);

              if (avatarFile) {
                const url = URL.createObjectURL(avatarFile);
                tempUrls.push(url);
                draft.avatar = url;
                draft.avatarUrl = url;
              }
              if (bannerFile) {
                const url = URL.createObjectURL(bannerFile);
                tempUrls.push(url);
                draft.banner = url;
                draft.bannerUrl = url;
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        } finally {
          // Free up browser memory by revoking the preview URLs
          // once the network request finishes (success or fail).
          tempUrls.forEach((url) => URL.revokeObjectURL(url));
        }
      },
    }),

    unlockCreator: builder.mutation({
      query: () => ({
        url: "/users/me/unlock-creator",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
  }),
});

export const {
  useGetCurrentProfileQuery,
  useGetPublicProfileQuery,
  useUpdateCurrentProfileMutation,
  useUnlockCreatorMutation,
} = profileApi;
