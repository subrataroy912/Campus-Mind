import { baseApi } from "@/app/baseApi.js";

const exploreTags = [
  { type: "CourseFeed", id: "LIST" },
  { type: "CourseSearch", id: "LIST" },
  { type: "CourseRecommendations", id: "LIST" },
];

const discoveryFieldsChanged = (changes = {}) =>
  ["title", "subject", "visibility", "status"].some((field) =>
    Object.prototype.hasOwnProperty.call(changes, field),
  );

const normalizeCourse = (response = {}) => {
  const course = response?.data ?? response;
  const owner = course.owner ?? {
    id: course.ownerId,
    name: course.ownerName ?? "Space Owner",
    avatarUrl: course.ownerAvatarUrl,
  };

  const name =
    course.name ?? course.title ?? course.className ?? "Untitled class";

  return {
    ...course,
    id: course.id ?? course.courseId ?? course.classId,
    name,
    title: name,
    className: course.className ?? name,
    subtitle: course.section ?? course.subtitle ?? course.term ?? "",
    section: course.section ?? course.subtitle ?? "",
    code: course.code ?? course.enrollmentCode ?? course.classCode ?? "",
    spaceType: course.spaceType || "ACADEMIC_CLASS",
    meetingType: course.meetingType || "IN_PERSON",
    location: course.location || "",
    tags: Array.isArray(course.tags) ? course.tags : [],
    links: Array.isArray(course.links) ? course.links : [],
    accessType: (
      course.accessType || (course.visibility === "PUBLIC" ? "PUBLIC" : "LINK_ONLY")
    ).toUpperCase(),
    membershipStatus: course.membershipStatus ?? null,
    inviteToken: course.inviteToken ?? null,
    inviteUrl: course.inviteUrl ?? null,
    inviteExpiresAt: course.inviteExpiresAt ?? null,
    ownerId: course.ownerId,
    owner,
    role: course.role ?? "Joined",
    memberCount:
      course.memberCount ?? course.rosterCount ?? course.members?.length ?? 0,
    popularity: course.popularity ?? course.popularityScore ?? 0,
    coverUrl: course.coverUrl ?? course.cover_image_url ?? null,
    logo:
      course.logoUrl ??
      course.logo ??
      course.avatarUrl ??
      course.imageUrl ??
      null,
    theme: course.theme ?? null,
  };
};

const normalizeCourseList = (response) => {
  const payload = response?.data ?? response;
  const courses = Array.isArray(payload) ? payload : (payload?.content ?? []);
  return courses.map(normalizeCourse);
};

export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchClassrooms: builder.query({
      query: () => "/courses",
      transformResponse: normalizeCourseList,
      providesTags: (result) =>
        result
          ? [
              { type: "Classrooms", id: "LIST" },
              ...result.map((course) => ({
                type: "Classrooms",
                id: course.id ?? "unknown",
              })),
            ]
          : [{ type: "Classrooms", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    findClassroomById: builder.query({
      query: (classId) => `/courses/${classId}`,
      transformResponse: normalizeCourse,
      providesTags: (_result, _error, classId) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: classId },
      ],
      keepUnusedDataFor: 300,
    }),
    getClassroomRoster: builder.query({
      query: (classId) => `/courses/${classId}/roster`,
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload)
          ? payload
          : (payload?.content ?? []);
        return list.map((m) => {
          const role = String(m?.role || "member").toLowerCase();
          const name =
            m?.name ||
            m?.displayName ||
            m?.fullName ||
            (m?.userId ? `Member (${m.userId.slice(-4)})` : "Class Member");
          return {
            ...m,
            id: m?.id || m?.userId,
            name,
            role,
          };
        });
      },
      providesTags: (_result, _error, classId) => [
        { type: "Classrooms", id: `${classId}:roster` },
      ],
    }),
    createClassroom: builder.mutation({
      query: (details) => ({ url: "/courses", method: "POST", body: details }),
      transformResponse: normalizeCourse,
      invalidatesTags: (_result, _error, details) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Profile", id: "CURRENT" },
        ...(details?.visibility === "PUBLIC" ? exploreTags : []),
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            classroomApi.util.invalidateTags([
              { type: "Classrooms", id: "LIST" },
              { type: "Profile", id: "CURRENT" },
            ]),
          );
        } catch {
          // The mutation error is handled by the caller.
        }
      },
    }),
    updateClassroom: builder.mutation({
      query: ({ courseId, changes }) => ({
        url: `/courses/${courseId}`,
        method: "PATCH",
        body: changes,
      }),
      transformResponse: normalizeCourse,
      invalidatesTags: (result, _error, { changes = {} } = {}) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: result?.id ?? "unknown" },
        ...(discoveryFieldsChanged(changes) ? exploreTags : []),
      ],
      async onQueryStarted(
        { courseId, changes },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          classroomApi.util.updateQueryData(
            "findClassroomById",
            courseId,
            (draft) => {
              Object.assign(draft, changes);
            },
          ),
        );
        const listPatchResult = dispatch(
          classroomApi.util.updateQueryData(
            "fetchClassrooms",
            undefined,
            (draft) => {
              const course = draft.find((c) => c.id === courseId);
              if (course) Object.assign(course, changes);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
    deleteClassroom: builder.mutation({
      query: (courseId) => ({ url: `/courses/${courseId}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Classrooms", id: "LIST" },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
    }),
    archiveClassroom: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/archive`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Classrooms", id: "LIST" },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
    }),
    requestCourseCoverUpload: builder.mutation({
      query: () => ({ url: "/courses/cover-upload", method: "POST" }),
    }),
    requestCourseLogoUpload: builder.mutation({
      query: () => ({ url: "/courses/logo-upload", method: "POST" }),
    }),
    joinClassroom: builder.mutation({
      query: ({ courseId, code }) => {
        if (courseId) {
          return {
            url: `/courses/${courseId}/enrollment`,
            method: "POST",
            body: code ? { code } : {},
          };
        }
        return {
          url: "/courses/join",
          method: "POST",
          body: { code },
        };
      },
      transformResponse: normalizeCourse,
      invalidatesTags: (result) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: result?.id ?? "unknown" },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            classroomApi.util.invalidateTags([
              { type: "Classrooms", id: "LIST" },
              { type: "Profile", id: "CURRENT" },
            ]),
          );
        } catch {
          // The mutation error is handled by the caller.
        }
      },
    }),
    leaveClassroom: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/enrollment`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Classrooms", id: "LIST" },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
    }),
    removeCourseMember: builder.mutation({
      query: ({ courseId, userId }) => ({
        url: `/courses/${courseId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: `${courseId}:roster` },
      ],
    }),
    updateMemberRole: builder.mutation({
      query: ({ courseId, userId, role }) => ({
        url: `/courses/${courseId}/members/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: `${courseId}:roster` },
      ],
    }),
    cancelJoinRequest: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/join-request`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, courseId) => [
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: "LIST" },
      ],
    }),
    getPendingJoinRequests: builder.query({
      query: (courseId) => `/courses/${courseId}/join-requests`,
      providesTags: (_result, _error, courseId) => [
        { type: "Classrooms", id: `${courseId}:requests` },
      ],
    }),
    approveJoinRequest: builder.mutation({
      query: ({ courseId, userId }) => ({
        url: `/courses/${courseId}/join-requests/${userId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: `${courseId}:roster` },
        { type: "Classrooms", id: `${courseId}:requests` },
      ],
    }),
    declineJoinRequest: builder.mutation({
      query: ({ courseId, userId }) => ({
        url: `/courses/${courseId}/join-requests/${userId}/decline`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: `${courseId}:requests` },
      ],
    }),
    generateInviteLink: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/invite-link`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, courseId) => [
        { type: "Classrooms", id: courseId },
      ],
    }),
    validateInviteToken: builder.query({
      query: (token) => `/courses/invite/${token}/validate`,
    }),
  }),
});

export const {
  useFetchClassroomsQuery,
  useFindClassroomByIdQuery,
  useGetClassroomRosterQuery,
  useRequestCourseCoverUploadMutation,
  useRequestCourseLogoUploadMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  useArchiveClassroomMutation,
  useLeaveClassroomMutation,
  useRemoveCourseMemberMutation,
  useUpdateMemberRoleMutation,
  useCreateClassroomMutation,
  useJoinClassroomMutation,
  useCancelJoinRequestMutation,
  useGetPendingJoinRequestsQuery,
  useApproveJoinRequestMutation,
  useDeclineJoinRequestMutation,
  useGenerateInviteLinkMutation,
  useValidateInviteTokenQuery,
} = classroomApi;
