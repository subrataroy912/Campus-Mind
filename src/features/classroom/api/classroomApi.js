import { baseApi } from "@/app/baseApi.js";

const normalizeCourse = (course = {}) => {
  const teacher =
    course.teacher ??
    course.instructor ??
    course.owner ??
    {
      name: course.teacherName ?? course.ownerName ?? "CampusMind teacher",
    };

  const name = course.name ?? course.title ?? course.className ?? "Untitled class";

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
    memberCount: course.memberCount ?? course.rosterCount ?? course.members?.length ?? 0,
    popularity: course.popularity ?? course.popularityScore ?? 0,
    logo: course.logo ?? course.avatarUrl ?? course.imageUrl ?? null,
    theme: course.theme ?? "bg-primary",
  };
};

const normalizeCourseList = (response) => {
  const courses = Array.isArray(response) ? response : response?.content ?? [];
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
      providesTags: (_result, _error, classId) => [{ type: "Classrooms", id: classId }],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
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
} = classroomApi;