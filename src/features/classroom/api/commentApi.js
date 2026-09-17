import { baseApi } from "@/app/baseApi.js";

const normalizeComment = (comment = {}) => ({
  ...comment,
  id: comment.id ?? comment.commentId,
  content: comment.content ?? comment.body ?? comment.message ?? "",
  author: comment.author ?? { name: comment.authorName ?? "User" },
  createdAt: comment.createdAt ?? comment.created_at ?? null,
});

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseworkComments: builder.query({
      query: ({ courseworkId }) => `/coursework/${courseworkId}/comments`,
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : payload?.content ?? [];
        return list.map(normalizeComment);
      },
      providesTags: (_result, _error, { courseworkId }) => [
        { type: "CourseworkComments", id: courseworkId },
      ],
    }),
    addCourseworkComment: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/comments`,
        method: "POST",
        body: {
          content: payload.content || payload.body || payload.message || "",
          body: payload.body || payload.content || payload.message || "",
        },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
      invalidatesTags: (_result, _error, { courseworkId }) => [
        { type: "CourseworkComments", id: courseworkId },
      ],
      async onQueryStarted({ courseworkId, payload }, { dispatch, queryFulfilled, getState }) {
        const authUser = getState().auth?.user;
        const tempId = `temp-${Date.now()}`;
        const optimisticComment = normalizeComment({
          id: tempId,
          content: payload.content || payload.body || payload.message || "",
          body: payload.body || payload.content || payload.message || "",
          author: authUser
            ? {
                id: authUser.id,
                name: authUser.name || authUser.username || "You",
                avatarUrl: authUser.avatarUrl || authUser.avatar,
              }
            : { name: "You" },
          createdAt: new Date().toISOString(),
        });

        const patchResult = dispatch(
          commentApi.util.updateQueryData(
            "getCourseworkComments",
            { courseworkId },
            (draft) => {
              if (Array.isArray(draft)) {
                draft.push(optimisticComment);
              }
            }
          )
        );

        try {
          const { data: savedComment } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getCourseworkComments",
              { courseworkId },
              (draft) => {
                if (Array.isArray(draft)) {
                  const idx = draft.findIndex((c) => c.id === tempId);
                  if (idx !== -1) {
                    draft[idx] = savedComment;
                  }
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getSubmissionComments: builder.query({
      query: ({ submissionId }) => `/submissions/${submissionId}/comments`,
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : payload?.content ?? [];
        return list.map(normalizeComment);
      },
      providesTags: (_result, _error, { submissionId }) => [
        { type: "SubmissionComments", id: submissionId },
      ],
    }),
    addSubmissionComment: builder.mutation({
      query: ({ submissionId, payload = {} }) => ({
        url: `/submissions/${submissionId}/comments`,
        method: "POST",
        body: {
          content: payload.content || payload.body || payload.message || "",
          body: payload.body || payload.content || payload.message || "",
        },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
      invalidatesTags: (_result, _error, { submissionId }) => [
        { type: "SubmissionComments", id: submissionId },
      ],
    }),
  }),
});

export const {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
  useGetSubmissionCommentsQuery,
  useAddSubmissionCommentMutation,
} = commentApi;
