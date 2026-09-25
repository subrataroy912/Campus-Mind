import { baseApi } from "@/app/baseApi.js";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query({
      query: ({ unreadOnly = false, page = 0, size = 20 } = {}) => ({
        url: "/notifications",
        params: { unreadOnly, page, size },
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const markInDraft = (draft) => {
          const list = Array.isArray(draft)
            ? draft
            : draft?.content || draft?.data;
          if (Array.isArray(list)) {
            const item = list.find(
              (n) => n.id === notificationId || n._id === notificationId,
            );
            if (item) {
              item.read = true;
              item.isRead = true;
            }
          }
        };

        const patches = [
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              { unreadOnly: true, page: 0, size: 10 },
              markInDraft,
            ),
          ),
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              { unreadOnly: false, page: 0, size: 20 },
              markInDraft,
            ),
          ),
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              undefined,
              markInDraft,
            ),
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ["Notifications"],
    }),
    getNotificationSettings: builder.query({
      query: () => "/notifications/settings",
      providesTags: ["NotificationSettings"],
    }),
    updateNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: "/notifications/settings",
        method: "PATCH",
        body: settings,
      }),
      invalidatesTags: ["NotificationSettings"],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationsApi;
