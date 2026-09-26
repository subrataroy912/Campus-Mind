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
      query: (profile) => ({
        url: "/users/me",
        method: "PATCH",
        body: profile,
      }),
      invalidatesTags: [
        { type: "Profile", id: "CURRENT" },
        { type: "Classrooms", id: "LIST" },
      ],
      async onQueryStarted(profile, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              Object.assign(draft, profile);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateCurrentHandle: builder.mutation({
      query: (payload) => ({
        url: "/users/me/handle",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Profile", id: "CURRENT" },
        { type: "Classrooms", id: "LIST" },
      ],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              if (draft && payload?.handle) {
                draft.handle = payload.handle;
              }
            },
          ),
        );
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              profileApi.util.updateQueryData(
                "getCurrentProfile",
                undefined,
                (draft) => {
                  Object.assign(draft, data);
                },
              ),
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),

    uploadAvatar: builder.mutation({
      query: (file) => {
        const body = new FormData();
        body.append("file", file, file.name);
        return { url: "/users/me/avatar", method: "PUT", body };
      },
      invalidatesTags: [
        { type: "Profile", id: "CURRENT" },
        { type: "Classrooms", id: "LIST" },
      ],
      async onQueryStarted(file, { dispatch, queryFulfilled }) {
        const url = URL.createObjectURL(file);
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              draft.avatar = url;
              draft.avatarUrl = url;
            },
          ),
        );
        try {
          const { data } = await queryFulfilled;
          const remoteUrl = data?.avatarUrl || data?.data?.avatarUrl;
          if (remoteUrl) {
            dispatch(
              profileApi.util.updateQueryData(
                "getCurrentProfile",
                undefined,
                (draft) => {
                  draft.avatar = remoteUrl;
                  draft.avatarUrl = remoteUrl;
                },
              ),
            );
          }
        } catch {
          patchResult.undo();
        } finally {
          URL.revokeObjectURL(url);
        }
      },
    }),

    deleteAvatar: builder.mutation({
      query: () => ({
        url: "/users/me/avatar",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Profile", id: "CURRENT" },
        { type: "Classrooms", id: "LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              draft.avatar = null;
              draft.avatarUrl = null;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    uploadBanner: builder.mutation({
      query: (file) => {
        const body = new FormData();
        body.append("file", file, file.name);
        return { url: "/users/me/banner", method: "PUT", body };
      },
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
      async onQueryStarted(file, { dispatch, queryFulfilled }) {
        const url = URL.createObjectURL(file);
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              draft.banner = url;
              draft.bannerUrl = url;
            },
          ),
        );
        try {
          const { data } = await queryFulfilled;
          const remoteUrl = data?.bannerUrl || data?.data?.bannerUrl;
          if (remoteUrl) {
            dispatch(
              profileApi.util.updateQueryData(
                "getCurrentProfile",
                undefined,
                (draft) => {
                  draft.banner = remoteUrl;
                  draft.bannerUrl = remoteUrl;
                },
              ),
            );
          }
        } catch {
          patchResult.undo();
        } finally {
          URL.revokeObjectURL(url);
        }
      },
    }),

    deleteBanner: builder.mutation({
      query: () => ({
        url: "/users/me/banner",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData(
            "getCurrentProfile",
            undefined,
            (draft) => {
              draft.banner = null;
              draft.bannerUrl = null;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateCreatorProfile: builder.mutation({
      query: (payload) => ({
        url: "/users/me/creator-profile",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),

    unlockCreator: builder.mutation({
      query: () => ({
        url: "/users/me/creator/unlock",
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
  useUpdateCurrentHandleMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useUploadBannerMutation,
  useDeleteBannerMutation,
  useUpdateCreatorProfileMutation,
  useDeleteAccountMutation,
  useUnlockCreatorMutation,
} = profileApi;
