import { baseApi } from "@/app/baseApi.js";

export const HISTORY_PAGE_LIMIT = 30;

export function syncEventIntoRoomCache(dispatch, spaceId, payload, currentUserId) {
  if (!spaceId || !payload) return;

  if (payload.type === "TEXT_MESSAGE" || payload.type === "MEDIA_MESSAGE") {
    dispatch(
      messagesApi.util.updateQueryData(
        "getSpaceChatHistory",
        { spaceId, limit: HISTORY_PAGE_LIMIT },
        (draft) => {
          if (!draft) return;
          const list = Array.isArray(draft.items) ? draft.items : [];
          const existsIdx = list.findIndex((m) => m.eventId === payload.eventId);
          if (existsIdx >= 0) {
            list[existsIdx] = payload;
          } else {
            list.push(payload);
          }
          draft.items = list;
          draft.messages = list;
        },
      ),
    );

    dispatch(
      messagesApi.util.updateQueryData(
        "getSpaceChatRooms",
        undefined,
        (draft) => {
          if (!Array.isArray(draft)) return;
          const room = draft.find((r) => r.spaceId === spaceId);
          if (!room) return;
          room.lastMessageText =
            payload.content ||
            (payload.attachments?.length ? "Shared an attachment" : "");
          room.lastMessageSender =
            payload.sender?.username || room.lastMessageSender || null;
          room.lastMessageAt = payload.timestamp || new Date().toISOString();
          if (
            currentUserId &&
            String(payload.sender?.userId || payload.senderId) ===
              String(currentUserId)
          ) {
            room.unreadCount = 0;
          }
          draft.sort(
            (a, b) =>
              new Date(b.lastMessageAt || 0).getTime() -
              new Date(a.lastMessageAt || 0).getTime(),
          );
        },
      ),
    );
    return;
  }

  if (payload.type === "REACTION_ADDED" || payload.type === "REACTION_REMOVED") {
    const targetId = payload.targetMessageId || payload.eventId;
    if (!targetId || !payload.reactions) return;
    dispatch(
      messagesApi.util.updateQueryData(
        "getSpaceChatHistory",
        { spaceId, limit: HISTORY_PAGE_LIMIT },
        (draft) => {
          if (!draft || !Array.isArray(draft.items)) return;
          const msg = draft.items.find((m) => m.eventId === targetId);
          if (msg) {
            msg.reactions = payload.reactions;
          }
        },
      ),
    );
    return;
  }

  if (payload.type === "MESSAGE_DELETED") {
    const targetId = payload.targetMessageId || payload.eventId;
    if (!targetId) return;
    dispatch(
      messagesApi.util.updateQueryData(
        "getSpaceChatHistory",
        { spaceId, limit: HISTORY_PAGE_LIMIT },
        (draft) => {
          if (!draft || !Array.isArray(draft.items)) return;
          draft.items = draft.items.filter((m) => m.eventId !== targetId);
          draft.messages = draft.items;
        },
      ),
    );
  }
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpaceChatRooms: builder.query({
      query: () => "/messages/spaces",
      transformResponse: (res) => {
        const list = res?.data ?? res;
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["Notifications"],
      keepUnusedDataFor: 300,
    }),
    getSpaceChatHistory: builder.query({
      query: ({ spaceId, before, cursor, limit = HISTORY_PAGE_LIMIT }) => ({
        url: `/messages/spaces/${spaceId}`,
        params: {
          ...(before || cursor ? { before: before || cursor } : {}),
          limit,
        },
      }),
      transformResponse: (res) => {
        const payload = res?.data ?? res;
        const list = Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.messages)
            ? payload.messages
            : [];
        return {
          spaceId: payload?.spaceId ?? null,
          items: list,
          messages: list,
          nextCursor: payload?.nextCursor ?? null,
          hasMore: Boolean(payload?.hasMore),
          joinedAt: payload?.joinedAt ?? null,
        };
      },
      keepUnusedDataFor: 300,
    }),
    uploadSpaceChatImage: builder.mutation({
      query: ({ spaceId, file }) => {
        const body = new FormData();
        body.append("file", file, file.name || "image.webp");
        return {
          url: `/messages/spaces/${spaceId}/upload-image`,
          method: "POST",
          body,
        };
      },
      transformResponse: (res) => res?.data ?? res,
    }),
    sendSpaceMessageRest: builder.mutation({
      query: ({ spaceId, content, attachments = [] }) => ({
        url: `/messages/spaces/${spaceId}`,
        method: "POST",
        body: { content, attachments },
      }),
      transformResponse: (res) => res?.data ?? res,
      async onQueryStarted({ spaceId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            syncEventIntoRoomCache(dispatch, spaceId, data, null);
          }
        } catch {
          // Handled by caller
        }
      },
    }),
    toggleSpaceReactionRest: builder.mutation({
      query: ({ spaceId, targetMessageId, emoji }) => ({
        url: `/messages/spaces/${spaceId}/reactions`,
        method: "POST",
        body: { targetMessageId, emoji },
      }),
      transformResponse: (res) => res?.data ?? res,
    }),
    markSpaceChatRead: builder.mutation({
      query: (spaceId) => ({
        url: `/messages/spaces/${spaceId}/read`,
        method: "POST",
      }),
      async onQueryStarted(spaceId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          messagesApi.util.updateQueryData(
            "getSpaceChatRooms",
            undefined,
            (draft) => {
              if (!Array.isArray(draft)) return;
              const room = draft.find((r) => r.spaceId === spaceId);
              if (room) {
                room.unreadCount = 0;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    deleteSpaceMessage: builder.mutation({
      query: ({ spaceId, messageId }) => ({
        url: `/messages/spaces/${spaceId}/${messageId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSpaceChatRoomsQuery,
  useGetSpaceChatHistoryQuery,
  useLazyGetSpaceChatHistoryQuery,
  useUploadSpaceChatImageMutation,
  useSendSpaceMessageRestMutation,
  useToggleSpaceReactionRestMutation,
  useMarkSpaceChatReadMutation,
  useDeleteSpaceMessageMutation,
} = messagesApi;
