import { baseApi } from "@/app/baseApi.js";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query({
      query: ({ unreadOnly = false, page = 0, size = 20 } = {}) => ({
        url: "/notifications",
        params: { unreadOnly, page, size },
      }),
      transformResponse: (response) =>
        response?.content ?? response?.data ?? [],
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    getNotificationSettings: builder.query({
      query: () => "/notifications/settings",
      providesTags: ["Notifications"],
    }),
    updateNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: "/notifications/settings",
        method: "PATCH",
        body: settings,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationsApi;
