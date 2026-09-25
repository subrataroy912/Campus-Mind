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
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const markAllInDraft = (draft) => {
          const list = Array.isArray(draft)
            ? draft
            : draft?.content || draft?.data;
          if (Array.isArray(list)) {
            list.forEach((item) => {
              item.read = true;
              item.isRead = true;
            });
          }
        };

        const patches = [
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              { unreadOnly: true, page: 0, size: 10 },
              markAllInDraft,
            ),
          ),
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              { unreadOnly: false, page: 0, size: 20 },
              markAllInDraft,
            ),
          ),
          dispatch(
            notificationsApi.util.updateQueryData(
              "listNotifications",
              undefined,
              markAllInDraft,
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

const CACHED_QUERY_ARGS = [
  { unreadOnly: true, page: 0, size: 10 },
  { unreadOnly: false, page: 0, size: 20 },
  undefined,
];

export function prependNotificationToCache(dispatch, notification) {
  if (!dispatch || !notification) return;
  const notifId = notification.id || notification._id;

  const insertIntoDraft = (draft) => {
    if (Array.isArray(draft)) {
      if (notifId && draft.some((n) => (n.id || n._id) === notifId)) return;
      draft.unshift(notification);
      return;
    }
    const list = draft?.content || draft?.data;
    if (Array.isArray(list)) {
      if (notifId && list.some((n) => (n.id || n._id) === notifId)) return;
      list.unshift(notification);
      if (typeof draft.totalElements === "number") {
        draft.totalElements += 1;
      }
    }
  };

  CACHED_QUERY_ARGS.forEach((arg) => {
    dispatch(
      notificationsApi.util.updateQueryData(
        "listNotifications",
        arg,
        insertIntoDraft,
      ),
    );
  });
}

export function syncNotificationReadInCache(
  dispatch,
  { notificationId, all = false } = {},
) {
  if (!dispatch) return;

  const updateDraft = (draft) => {
    const list = Array.isArray(draft) ? draft : draft?.content || draft?.data;
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      const id = item.id || item._id;
      if (all || (notificationId && id === notificationId)) {
        item.read = true;
        item.isRead = true;
      }
    });
  };

  CACHED_QUERY_ARGS.forEach((arg) => {
    dispatch(
      notificationsApi.util.updateQueryData(
        "listNotifications",
        arg,
        updateDraft,
      ),
    );
  });
}

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = notificationsApi;
