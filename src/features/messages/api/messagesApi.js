import { baseApi } from "@/app/baseApi.js";

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpaceChatRooms: builder.query({
      query: () => "/messages/spaces",
      transformResponse: (res) => {
        const list = res?.data ?? res;
        return Array.isArray(list) ? list : [];
      },
      providesTags: ["Notifications"],
      keepUnusedDataFor: 120,
    }),
    getSpaceChatHistory: builder.query({
      query: ({ spaceId, before, cursor, limit = 30 }) => ({
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
      keepUnusedDataFor: 60,
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
      invalidatesTags: ["Notifications"],
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

