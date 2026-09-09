import { baseApi } from "@/app/baseApi.js";

const normalizeCourse = (response = {}) => {
  const course = response?.data ?? response;
  const teacher = course.teacher ??
    course.instructor ??
    course.owner ?? {
      name: course.teacherName ?? course.ownerName ?? "CampusMind teacher",
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
    teacherId: course.teacherId ?? course.ownerId,
    teacher,
    instructor: teacher,
    role: course.role ?? "Joined",
    memberCount:
      course.memberCount ?? course.rosterCount ?? course.members?.length ?? 0,
    popularity: course.popularity ?? course.popularityScore ?? 0,
    coverUrl: course.coverUrl ?? course.cover_image_url ?? null,
    logo:
      course.logo ??
      course.avatarUrl ??
      course.imageUrl ??
      course.coverUrl ??
      null,
    theme: course.theme ?? "bg-primary",
  };
};

const normalizeCourseList = (response) => {
  const payload = response?.data ?? response;
  const courses = Array.isArray(payload) ? payload : payload?.content ?? [];
  return courses.map(normalizeCourse);
};

export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchClassrooms: builder.query({
      query: () => "/courses",
      transformResponse: normalizeCourseList,
      providesTags: ["Classrooms"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    fetchExploreClassrooms: builder.query({
      query: () => "/explore/feed",
      transformResponse: normalizeCourseList,
      providesTags: ["Classrooms"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    findClassroomById: builder.query({
      query: (classId) => `/courses/${classId}`,
      transformResponse: normalizeCourse,
      providesTags: (_result, _error, classId) => [
        { type: "Classrooms", id: classId },
      ],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    getClassroomRoster: builder.query({
      query: (classId) => `/courses/${classId}/roster`,
      transformResponse: (response) => response?.data ?? response ?? [],
      providesTags: ["Classrooms"],
    }),
    createClassroom: builder.mutation({
      query: (details) => ({ url: "/courses", method: "POST", body: details }),
      transformResponse: normalizeCourse,
      invalidatesTags: ["Classrooms", "Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(classroomApi.util.invalidateTags(["Classrooms", "Profile"]));
        } catch {
          // The mutation error is handled by the caller.
        }
      },
    }),
    requestCourseCoverUpload: builder.mutation({
      query: () => ({ url: "/courses/cover-upload", method: "POST" }),
    }),
    joinClassroom: builder.mutation({
      query: ({ courseId, code }) => ({
        url: `/courses/${courseId}/enrollment`,
        method: "POST",
        body: { code },
      }),
      transformResponse: normalizeCourse,
      invalidatesTags: ["Classrooms", "Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(classroomApi.util.invalidateTags(["Classrooms", "Profile"]));
        } catch {
          // The mutation error is handled by the caller.
        }
      },
    }),
  }),
});

export const {
  useFetchClassroomsQuery,
  useFetchExploreClassroomsQuery,
  useFindClassroomByIdQuery,
  useGetClassroomRosterQuery,
  useRequestCourseCoverUploadMutation,
} = classroomApi;
