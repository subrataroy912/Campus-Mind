import { baseApi } from "@/app/baseApi.js";
import { setActiveCourse } from "../courseContextSlice.js";

const exploreTags = [
  { type: "CourseFeed", id: "LIST" },
  { type: "CourseSearch", id: "LIST" },
  { type: "CourseRecommendations", id: "LIST" },
];

const discoveryFieldsChanged = (changes = {}) =>
  ["title", "subject", "status"].some((field) =>
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
    id: course.id ?? course.courseId ?? course.classId ?? course._id,
    name,
    title: name,
    className: course.className ?? name,
    subtitle: course.section ?? course.subtitle ?? course.term ?? "",
    section: course.section ?? course.subtitle ?? "",
    code: course.code ?? course.enrollmentCode ?? course.classCode ?? "",
    tags: Array.isArray(course.tags) ? course.tags : [],
    links: Array.isArray(course.links) ? course.links : [],
    accessType: (course.accessType || "PUBLIC").toUpperCase(),
    membershipStatus: course.membershipStatus ?? null,
    inviteToken: course.inviteToken ?? null,
    inviteUrl: course.inviteUrl ?? null,
    inviteExpiresAt: course.inviteExpiresAt ?? null,
    ownerId: course.ownerId,
    owner,
    role:
      course.role ??
      (course.enrolled || course.isEnrolled ? "MEMBER" : "VIEWER"),
    isEnrolled:
      typeof course.enrolled === "boolean"
        ? course.enrolled
        : typeof course.isEnrolled === "boolean"
        ? course.isEnrolled
        : Boolean(course.role && String(course.role).toUpperCase() !== "VIEWER"),
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

const getDraftCourseList = (draft) =>
  Array.isArray(draft)
    ? draft
    : Array.isArray(draft?.data)
    ? draft.data
    : null;

const matchesCourseId = (course, targetId) =>
  String(course?.id || course?.courseId || course?._id) === String(targetId);

const applyClassroomChanges = (target, changes = {}) => {
  if (!target) return;
  Object.assign(target, changes);
  if (changes.title) {
    target.title = changes.title;
    target.name = changes.title;
    target.className = changes.title;
  }
  if (changes.section !== undefined) {
    target.section = changes.section;
    target.subtitle = changes.section;
  }
  if (changes.logoUrl !== undefined) {
    target.logoUrl = changes.logoUrl;
    target.logo = changes.logoUrl;
  }
  if (changes.coverUrl !== undefined) {
    target.coverUrl = changes.coverUrl;
    target.cover = changes.coverUrl;
  }
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
      async onQueryStarted(details, { dispatch, queryFulfilled }) {
        try {
          const { data: newCourse } = await queryFulfilled;
          if (newCourse && newCourse.id) {
            dispatch(
              classroomApi.util.upsertQueryData(
                "findClassroomById",
                newCourse.id,
                newCourse,
              ),
            );
            dispatch(
              classroomApi.util.updateQueryData(
                "fetchClassrooms",
                undefined,
                (draft) => {
                  getDraftCourseList(draft)?.unshift(newCourse);
                },
              ),
            );
          }
        } catch {
          // handled by invalidation
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
      invalidatesTags: (result, _error, { courseId, changes = {} } = {}) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: result?.id ?? courseId ?? "unknown" },
        ...(discoveryFieldsChanged(changes) ? exploreTags : []),
      ],
      async onQueryStarted(
        { courseId, changes },
        { dispatch, queryFulfilled },
      ) {
        if (!courseId) return;

        const patchResult = dispatch(
          classroomApi.util.updateQueryData(
            "findClassroomById",
            courseId,
            (draft) => applyClassroomChanges(draft, changes),
          ),
        );
        const listPatchResult = dispatch(
          classroomApi.util.updateQueryData(
            "fetchClassrooms",
            undefined,
            (draft) => {
              const list = getDraftCourseList(draft);
              const course = list?.find((c) => matchesCourseId(c, courseId));
              applyClassroomChanges(course, changes);
            },
          ),
        );
        try {
          const { data: updated } = await queryFulfilled;
          if (updated) {
            dispatch(
              classroomApi.util.updateQueryData(
                "findClassroomById",
                courseId,
                (draft) => {
                  if (draft) Object.assign(draft, updated);
                },
              ),
            );
            dispatch(
              classroomApi.util.updateQueryData(
                "fetchClassrooms",
                undefined,
                (draft) => {
                  const list = getDraftCourseList(draft);
                  if (!list) return;
                  const idx = list.findIndex((c) =>
                    matchesCourseId(c, courseId),
                  );
                  if (idx !== -1) {
                    list[idx] = { ...list[idx], ...updated };
                  }
                },
              ),
            );
          }
        } catch {
          patchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
    deleteClassroom: builder.mutation({
      query: (courseId) => ({ url: `/courses/${courseId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, courseId) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: courseId },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
      async onQueryStarted(courseId, { dispatch, queryFulfilled }) {
        if (!courseId) return;
        const patchResult = dispatch(
          classroomApi.util.updateQueryData(
            "fetchClassrooms",
            undefined,
            (draft) => {
              const list = getDraftCourseList(draft);
              if (!list) return;
              const idx = list.findIndex((c) => matchesCourseId(c, courseId));
              if (idx !== -1) list.splice(idx, 1);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      invalidatesTags: (result, _error, arg) => {
        const courseId =
          result?.id ?? (typeof arg === "string" ? arg : arg?.courseId) ?? "unknown";
        return [
          { type: "Classrooms", id: "LIST" },
          { type: "Classrooms", id: courseId },
          { type: "Classrooms", id: `${courseId}:roster` },
          { type: "Profile", id: "CURRENT" },
          ...exploreTags,
        ];
      },
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const courseId = typeof arg === "string" ? arg : arg?.courseId;
        const patches = [];
        const previousContext = getState()?.courseContext;

        // 1. Optimistically update findClassroomById and fetchClassrooms if courseId is known
        if (courseId) {
          const cachedCourse =
            classroomApi.endpoints.findClassroomById.select(courseId)(
              getState(),
            )?.data;
          const isPrivateSpace =
            String(cachedCourse?.accessType || "").toUpperCase() === "PRIVATE";

          patches.push(
            dispatch(
              classroomApi.util.updateQueryData(
                "findClassroomById",
                courseId,
                (draft) => {
                  if (!draft) return;
                  if (
                    String(draft.accessType || "").toUpperCase() === "PRIVATE"
                  ) {
                    draft.membershipStatus = "PENDING";
                    draft.isEnrolled = false;
                    draft.enrolled = false;
                  } else {
                    draft.role =
                      draft.role && draft.role !== "VIEWER"
                        ? draft.role
                        : "MEMBER";
                    draft.isEnrolled = true;
                    draft.enrolled = true;
                    draft.membershipStatus = "ENROLLED";
                    draft.memberCount = (draft.memberCount || 0) + 1;
                  }
                },
              ),
            ),
          );

          if (!isPrivateSpace) {
            if (previousContext?.activeCourseId === courseId) {
              dispatch(
                setActiveCourse({
                  courseId,
                  role:
                    previousContext.userRole &&
                    previousContext.userRole !== "VIEWER"
                      ? previousContext.userRole
                      : "MEMBER",
                  isStaff: Boolean(previousContext.isStaff),
                  isEnrolled: true,
                }),
              );
            }

            if (cachedCourse) {
              const optimisticCourse = {
                ...cachedCourse,
                role:
                  cachedCourse.role && cachedCourse.role !== "VIEWER"
                    ? cachedCourse.role
                    : "MEMBER",
                isEnrolled: true,
                enrolled: true,
                membershipStatus: "ENROLLED",
                memberCount: (cachedCourse.memberCount || 0) + 1,
              };
              patches.push(
                dispatch(
                  classroomApi.util.updateQueryData(
                    "fetchClassrooms",
                    undefined,
                    (draft) => {
                      const list = getDraftCourseList(draft);
                      if (!list) return;
                      const idx = list.findIndex((c) =>
                        matchesCourseId(c, courseId),
                      );
                      if (idx !== -1) {
                        list[idx] = { ...list[idx], ...optimisticCourse };
                      } else {
                        list.unshift(optimisticCourse);
                      }
                    },
                  ),
                ),
              );
            }
          }
        }

        try {
          const { data: joinedCourse } = await queryFulfilled;
          const targetId = joinedCourse?.id || courseId;
          if (targetId && joinedCourse) {
            const isPendingJoin =
              String(joinedCourse.membershipStatus || "").toUpperCase() ===
              "PENDING";

            // Seed findClassroomById with complete server response
            dispatch(
              classroomApi.util.upsertQueryData(
                "findClassroomById",
                targetId,
                joinedCourse,
              ),
            );

            if (getState()?.courseContext?.activeCourseId === targetId) {
              dispatch(
                setActiveCourse({
                  courseId: targetId,
                  role: joinedCourse.role || "MEMBER",
                  isStaff: Boolean(previousContext?.isStaff),
                  isEnrolled: !isPendingJoin && Boolean(joinedCourse.isEnrolled),
                }),
              );
            }

            // Immediately prepend or update in fetchClassrooms cache if enrolled
            if (!isPendingJoin) {
              dispatch(
                classroomApi.util.updateQueryData(
                  "fetchClassrooms",
                  undefined,
                  (draft) => {
                    const list = getDraftCourseList(draft);
                    if (list) {
                      const idx = list.findIndex((c) =>
                        matchesCourseId(c, targetId),
                      );
                      if (idx !== -1) {
                        list[idx] = { ...list[idx], ...joinedCourse };
                      } else {
                        list.unshift(joinedCourse);
                      }
                    }
                  },
                ),
              );
            }
          }
        } catch {
          patches.forEach((patch) => patch.undo());
          if (courseId && previousContext?.activeCourseId === courseId) {
            dispatch(
              setActiveCourse({
                courseId,
                role: previousContext.userRole,
                isStaff: previousContext.isStaff,
                isEnrolled: previousContext.isEnrolled,
              }),
            );
          }
        }
      },
    }),
    leaveClassroom: builder.mutation({
      query: (courseId) => ({
        url: `/courses/${courseId}/enrollment`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, courseId) => [
        { type: "Classrooms", id: "LIST" },
        { type: "Classrooms", id: courseId },
        { type: "Classrooms", id: `${courseId}:roster` },
        { type: "Profile", id: "CURRENT" },
        ...exploreTags,
      ],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const courseId = typeof arg === "string" ? arg : arg?.courseId;
        if (!courseId) return;
        const patches = [];
        const previousContext = getState()?.courseContext;

        if (previousContext?.activeCourseId === courseId) {
          dispatch(
            setActiveCourse({
              courseId,
              role: "VIEWER",
              isStaff: false,
              isEnrolled: false,
            }),
          );
        }

        // 1. Optimistically update findClassroomById
        patches.push(
          dispatch(
            classroomApi.util.updateQueryData(
              "findClassroomById",
              courseId,
              (draft) => {
                if (draft) {
                  draft.role = "VIEWER";
                  draft.isEnrolled = false;
                  draft.enrolled = false;
                  draft.membershipStatus = null;
                  if (draft.memberCount && draft.memberCount > 0) {
                    draft.memberCount -= 1;
                  }
                }
              },
            ),
          ),
        );

        // 2. Optimistically remove from fetchClassrooms list
        patches.push(
          dispatch(
            classroomApi.util.updateQueryData(
              "fetchClassrooms",
              undefined,
              (draft) => {
                const list = getDraftCourseList(draft);
                if (list) {
                  const idx = list.findIndex((c) =>
                    matchesCourseId(c, courseId),
                  );
                  if (idx !== -1) {
                    list.splice(idx, 1);
                  }
                }
              },
            ),
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
          if (previousContext?.activeCourseId === courseId) {
            dispatch(
              setActiveCourse({
                courseId,
                role: previousContext.userRole,
                isStaff: previousContext.isStaff,
                isEnrolled: previousContext.isEnrolled,
              }),
            );
          }
        }
      },
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
      async onQueryStarted(courseId, { dispatch, queryFulfilled }) {
        if (!courseId) return;
        const patchResult = dispatch(
          classroomApi.util.updateQueryData(
            "findClassroomById",
            courseId,
            (draft) => {
              if (draft) {
                draft.membershipStatus = null;
                draft.isEnrolled = false;
                draft.enrolled = false;
                draft.role = "VIEWER";
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
