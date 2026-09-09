import { baseApi } from "@/app/baseApi.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";

const normalizeCoursework = (item = {}) => ({
  ...item,
  id: item.id ?? item.courseworkId,
  title: item.title ?? item.name,
  description: item.description ?? item.instructions ?? "",
  type: item.type ?? "assignment",
  dueAt: item.dueAt ?? item.dueDate ?? null,
  maximumPoints: item.maximumPoints ?? item.pointsPossible ?? null,
  published: item.published ?? true,
  attachments: item.attachments ?? [],
  submittedCount: item.submittedCount ?? item.submissionCount ?? 0,
  totalCount: item.totalCount ?? 0,
});

const normalizeSubmission = (submission = {}) => ({
  ...submission,
  id: submission.id ?? submission.submissionId,
  status: submission.status ?? submission.state ?? "new",
  submittedAt: submission.submittedAt ?? submission.submitted_on ?? null,
  score: submission.score ?? submission.grade ?? null,
  submitted: submission.submitted ?? Boolean(submission.submittedAt),
});

export const courseworkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseworkList: builder.query({
      query: (courseId) => `/courses/${courseId}/coursework`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
        return list.map(normalizeCoursework);
      },
    }),
    getCourseworkById: builder.query({
      query: ({ courseId, courseworkId }) => `/courses/${courseId}/coursework/${courseworkId}`,
      transformResponse: (response) => normalizeCoursework(response?.data ?? response),
    }),
    createCoursework: builder.mutation({
      query: ({ courseId, payload }) => ({
        url: `/courses/${courseId}/coursework`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => normalizeCoursework(response?.data ?? response),
      invalidatesTags: ["Classrooms", "Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          triggerLifecycleRefresh(dispatch, "coursework-published");
        } catch {
          // The mutation error is already surfaced to the caller.
        }
      },
    }),
    getSubmissionList: builder.query({
      query: ({ courseId, courseworkId }) => `/courses/${courseId}/coursework/${courseworkId}/submissions`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
        return list.map(normalizeSubmission);
      },
    }),
    getMySubmission: builder.query({
      query: ({ courseId, courseworkId }) => `/courses/${courseId}/coursework/${courseworkId}/submissions/me`,
      transformResponse: (response) => normalizeSubmission(response?.data ?? response),
    }),
    startSubmission: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => normalizeSubmission(response?.data ?? response),
    }),
    saveSubmission: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions/me`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) => normalizeSubmission(response?.data ?? response),
    }),
    gradeSubmission: builder.mutation({
      query: ({ courseworkId, submissionId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions/${submissionId}/grade`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) => normalizeSubmission(response?.data ?? response),
      invalidatesTags: ["Classrooms", "Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          triggerLifecycleRefresh(dispatch, "submission-graded");
        } catch {
          // The mutation error is already surfaced to the caller.
        }
      },
    }),
  }),
});

export const {
  useGetCourseworkListQuery,
  useGetCourseworkByIdQuery,
  useCreateCourseworkMutation,
  useGetSubmissionListQuery,
  useGetMySubmissionQuery,
  useStartSubmissionMutation,
  useSaveSubmissionMutation,
  useGradeSubmissionMutation,
} = courseworkApi;
