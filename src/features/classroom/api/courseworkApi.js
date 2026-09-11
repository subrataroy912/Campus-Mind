import { baseApi } from "@/app/baseApi.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";

const normalizeCoursework = (item = {}) => ({
  ...item,
  id: item.id ?? item.courseworkId,
  title: item.title ?? item.name,
  description: item.description ?? item.instructions ?? "",
  type: item.type ?? "ASSIGNMENT",
  dueAt: item.dueAt ?? item.dueDate ?? null,
  maximumPoints: item.maximumPoints ?? item.pointsPossible ?? null,
  attachments: item.attachments ?? [],
  submittedCount: item.submittedCount ?? item.submissionCount ?? 0,
  totalCount: item.totalCount ?? 0,
});

const normalizeSubmission = (submission = {}) => ({
  ...submission,
  id: submission.id ?? submission.submissionId,
  status: submission.status ?? "DRAFT",
  submittedAt: submission.submittedAt ?? submission.submitted_on ?? null,
  score: submission.score ?? submission.grade ?? null,
  submitted: submission.submitted ?? Boolean(submission.submittedAt),
});

const normalizeGradebook = (response) => {
  const list = Array.isArray(response) ? response : response?.data ?? [];
  return list.map((item) => ({
    ...item,
    id: item.id ?? item.courseworkId ?? item.submissionId,
    assignmentTitle: item.assignmentTitle ?? item.courseworkTitle ?? item.title,
    dueDate: item.dueDate ?? item.dueAt ?? null,
    score: item.score ?? item.pointsEarned ?? null,
    outOf: item.outOf ?? item.maximumPoints ?? item.pointsPossible ?? null,
    status: item.status ?? item.state ?? "assigned",
  }));
};

export const courseworkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseworkList: builder.query({
      query: ({ courseId, page = 0, size = 20 }) => ({ url: `/courses/${courseId}/coursework`, params: { page, size } }),
      transformResponse: (response) => {
        return { ...response, content: response.content.map(normalizeCoursework) };
      },
      providesTags: (result, _error, { courseId }) => [
        { type: "Coursework", id: `LIST-${courseId}` },
        ...(result?.content?.map((item) => ({ type: "Coursework", id: item.id })) || []),
      ],
    }),
    getCourseworkById: builder.query({
      query: ({ courseId, courseworkId }) =>
        `/courses/${courseId}/coursework/${courseworkId}`,
      transformResponse: (response) =>
        normalizeCoursework(response?.data ?? response),
      providesTags: (_result, _error, { courseworkId }) => [{ type: "Coursework", id: courseworkId }],
    }),
    createCoursework: builder.mutation({
      query: ({ courseId, payload }) => ({
        url: `/courses/${courseId}/coursework`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeCoursework(response?.data ?? response),
      invalidatesTags: (result, _error, { courseId }) => [
        { type: "Coursework", id: `LIST-${courseId}` },
        "Classrooms", 
        "Profile"
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          triggerLifecycleRefresh(dispatch, "coursework-published");
        } catch {
          // The mutation error is already surfaced to the caller.
        }
      },
    }),
    updateCoursework: builder.mutation({
      query: ({ courseId, courseworkId, changes }) => ({ url: `/courses/${courseId}/coursework/${courseworkId}`, method: "PATCH", body: changes }),
      transformResponse: normalizeCoursework,
      invalidatesTags: (result, _error, { courseId, courseworkId }) => [
        { type: "Coursework", id: courseworkId },
        { type: "Coursework", id: `LIST-${courseId}` },
        "Classrooms"
      ],
      async onQueryStarted({ courseId, courseworkId, changes }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          courseworkApi.util.updateQueryData("getCourseworkById", { courseId, courseworkId }, (draft) => {
            Object.assign(draft, changes);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteCoursework: builder.mutation({
      query: ({ courseId, courseworkId }) => ({ url: `/courses/${courseId}/coursework/${courseworkId}`, method: "DELETE" }),
      invalidatesTags: (result, _error, { courseId, courseworkId }) => [
        { type: "Coursework", id: courseworkId },
        { type: "Coursework", id: `LIST-${courseId}` },
        "Classrooms"
      ],
    }),
    getSubmissionList: builder.query({
      query: ({ courseworkId, page = 0, size = 20 }) => ({ url: `/coursework/${courseworkId}/submissions`, params: { page, size } }),
      transformResponse: (response) => {
        return { ...response, content: response.content.map(normalizeSubmission) };
      },
      providesTags: (_result, _error, { courseworkId }) => [{ type: "Coursework", id: `SUBMISSIONS-${courseworkId}` }],
    }),
    getMySubmission: builder.query({
      query: ({ courseworkId }) => `/coursework/${courseworkId}/submissions/me`,
      transformResponse: (response) =>
        normalizeSubmission(response?.data ?? response),
      providesTags: (_result, _error, { courseworkId }) => [{ type: "Coursework", id: `MYSUBMISSION-${courseworkId}` }],
    }),
    getStudentGradebook: builder.query({
      query: ({ courseId, studentId }) =>
        `/analytics/courses/${courseId}/students/${studentId}/gradebook`,
      transformResponse: normalizeGradebook,
      providesTags: (_result, _error, { courseId, studentId }) => [{ type: "Coursework", id: `GRADEBOOK-${courseId}-${studentId}` }],
    }),
    getTeacherGradebook: builder.query({
      query: (courseId) => `/analytics/courses/${courseId}/gradebook`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : response?.data ?? [];
        return list.map((item) => ({
          ...item,
          id: item.studentId ?? item.id,
          studentName: item.studentName || "Student",
          avatar: item.avatarUrl ?? item.avatar ?? null,
          average: item.averageScore != null ? `${Math.round(item.averageScore)}%` : "—",
          missingCount: item.missingCount ?? 0,
        }));
      },
      providesTags: (_result, _error, courseId) => [
        { type: "Coursework", id: `TEACHER-GRADEBOOK-${courseId}` },
      ],
    }),
    getCourseAnalyticsSummary: builder.query({
      query: (courseId) => `/analytics/courses/${courseId}/summary`,
    }),
    startSubmission: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeSubmission(response?.data ?? response),
      async onQueryStarted({ courseworkId, payload }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          courseworkApi.util.updateQueryData("getMySubmission", { courseworkId }, (draft) => {
            Object.assign(draft, payload, { submitted: payload.submitted ?? true });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    saveSubmission: builder.mutation({
      query: ({ courseworkId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions/me`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeSubmission(response?.data ?? response),
      async onQueryStarted({ courseworkId, payload }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          courseworkApi.util.updateQueryData("getMySubmission", { courseworkId }, (draft) => {
            Object.assign(draft, payload);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    gradeSubmission: builder.mutation({
      query: ({ courseworkId, submissionId, payload = {} }) => ({
        url: `/coursework/${courseworkId}/submissions/${submissionId}/grade`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeSubmission(response?.data ?? response),
      invalidatesTags: (result, _error, { courseId, studentId }) => [
        "Classrooms", 
        "Profile",
        ...(courseId && studentId ? [{ type: "Coursework", id: `GRADEBOOK-${courseId}-${studentId}` }] : [])
      ],
      async onQueryStarted({ courseworkId, submissionId, payload }, { dispatch, queryFulfilled }) {
        const listPatchResult = dispatch(
          courseworkApi.util.updateQueryData("getSubmissionList", { courseworkId, page: 0, size: 20 }, (draft) => {
            if (draft && Array.isArray(draft.content)) {
              const sub = draft.content.find((s) => s.id === submissionId);
              if (sub) {
                if (payload.score !== undefined) sub.score = payload.score;
                if (payload.status !== undefined) sub.status = payload.status;
              }
            }
          })
        );
        try {
          await queryFulfilled;
          triggerLifecycleRefresh(dispatch, "submission-graded");
        } catch {
          listPatchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCourseworkListQuery,
  useGetCourseworkByIdQuery,
  useCreateCourseworkMutation,
  useUpdateCourseworkMutation,
  useDeleteCourseworkMutation,
  useGetSubmissionListQuery,
  useGetMySubmissionQuery,
  useGetStudentGradebookQuery,
  useGetTeacherGradebookQuery,
  useGetCourseAnalyticsSummaryQuery,
  useStartSubmissionMutation,
  useSaveSubmissionMutation,
  useGradeSubmissionMutation,
} = courseworkApi;
