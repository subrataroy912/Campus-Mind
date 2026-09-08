import { baseApi } from "@/app/baseApi.js";

const normalizeCourse = (course) => ({
  ...course,
  id: course.id ?? course.courseId,
  name: course.name ?? course.title,
  className: course.className ?? course.title,
  code: course.code ?? course.enrollmentCode,
  teacherId: course.teacherId ?? course.ownerId,
  popularity: course.popularity ?? course.popularityScore ?? 0,
});

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
      invalidatesTags: ["Classrooms"],
    }),
    joinClassroom: builder.mutation({
      query: ({ courseId, code }) => ({
        url: `/courses/${courseId}/enrollment`,
        method: "POST",
        body: { code },
      }),
      transformResponse: normalizeCourse,
      invalidatesTags: ["Classrooms"],
    }),
  }),
});

export const {
  useFetchClassroomsQuery,
  useFetchExploreClassroomsQuery,
  useFindClassroomByIdQuery,
} = classroomApi;