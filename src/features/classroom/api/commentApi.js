import { baseApi } from "@/app/baseApi.js";

const normalizeComment = (comment = {}) => ({
  ...comment,
  id: comment.id ?? comment.commentId,
  content: comment.content ?? comment.body ?? comment.message ?? "",
  author: comment.author ?? {
    id: comment.authorId ?? null,
    name: comment.authorName ?? "User",
    avatarUrl: comment.authorAvatarUrl ?? null,
    handle: comment.authorHandle ?? null,
  },
  authorName: comment.authorName ?? comment.author?.name ?? "User",
  authorAvatarUrl: comment.authorAvatarUrl ?? comment.author?.avatarUrl ?? null,
  authorHandle: comment.authorHandle ?? comment.author?.handle ?? null,
  createdAt: comment.createdAt ?? comment.created_at ?? null,
});

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseworkComments: builder.query({
      query: ({ courseworkId }) => `/coursework/${courseworkId}/comments`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
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
        body: { body: payload.body || payload.content },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
      invalidatesTags: (_result, _error, { courseworkId }) => [
        { type: "CourseworkComments", id: courseworkId },
      ],
      async onQueryStarted({ courseworkId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getCourseworkComments",
              { courseworkId },
              (draft) => {
                const exists = draft.some((c) => c.id === newComment.id);
                if (!exists) {
                  draft.push(newComment);
                }
              },
            ),
          );
        } catch {
          // Handled by caller/toast
        }
      },
    }),
    getSubmissionComments: builder.query({
      query: ({ submissionId }) => `/submissions/${submissionId}/comments`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
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
        body: { body: payload.body || payload.content },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
      invalidatesTags: (_result, _error, { submissionId }) => [
        { type: "SubmissionComments", id: submissionId },
      ],
      async onQueryStarted({ submissionId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getSubmissionComments",
              { submissionId },
              (draft) => {
                const exists = draft.some((c) => c.id === newComment.id);
                if (!exists) {
                  draft.push(newComment);
                }
              },
            ),
          );
        } catch {
          // Handled by caller/toast
        }
      },
    }),
  }),
});

export const {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
  useGetSubmissionCommentsQuery,
  useAddSubmissionCommentMutation,
} = commentApi;
