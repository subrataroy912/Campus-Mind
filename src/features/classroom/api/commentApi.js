import { baseApi } from "@/app/baseApi.js";

const normalizeComment = (comment = {}) => ({
  ...comment,
  id: comment.id ?? comment.commentId,
  content: comment.content ?? comment.message ?? "",
  author: comment.author ?? { name: comment.authorName ?? "User" },
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
    }),
    addCourseworkComment: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/comments`,
        method: "POST",
        body: { body: payload.body },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
    }),
    getSubmissionComments: builder.query({
      query: ({ submissionId }) => `/submissions/${submissionId}/comments`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
        return list.map(normalizeComment);
      },
    }),
    addSubmissionComment: builder.mutation({
      query: ({ submissionId, payload = {} }) => ({
        url: `/submissions/${submissionId}/comments`,
        method: "POST",
        body: { body: payload.body },
      }),
      transformResponse: (response) =>
        normalizeComment(response?.data ?? response),
    }),
  }),
});

export const {
  useGetCourseworkCommentsQuery,
  useAddCourseworkCommentMutation,
  useGetSubmissionCommentsQuery,
  useAddSubmissionCommentMutation,
} = commentApi;
