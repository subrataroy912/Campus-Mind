import { baseApi } from "@/app/baseApi.js";

const normalizeDiscoveryCourse = (course = {}) => {
  const courseId =
    course.courseId ?? course.id ?? course._id ?? course.classId ?? null;

  return {
    courseId,
    id: courseId,
    title: course.title ?? course.name ?? "Untitled course",
    subject: course.subject ?? "",
    tags: Array.isArray(course.tags) ? course.tags : [],
    coverUrl: course.coverUrl ?? course.cover ?? null,
    logoUrl: course.logoUrl ?? course.logo ?? null,
    logo: course.logoUrl ?? course.logo ?? null,
    enrollmentCount: course.enrollmentCount ?? course.memberCount ?? 0,
    popularityScore: course.popularityScore ?? 0,
    lastActivityAt: course.lastActivityAt ?? null,
    accessType: (course.accessType || "PUBLIC").toUpperCase(),
  };
};

export const normalizeDiscoveryPage = (response = {}) => {
  const page = response?.data ?? response;
  return {
    ...page,
    content: (page?.content ?? []).map(normalizeDiscoveryCourse),
  };
};

const normalizePeoplePage = (response = {}) => {
  const payload = response?.content ?? response?.data ?? response;
  const users = Array.isArray(payload) ? payload : [];

  const transformedUsers = users.map((u) => ({
    ...u,
    id: u.id ?? u.userId,
    name:
      u.name ||
      u.displayName ||
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      "CampusMind member",
    avatar: u.avatar ?? u.avatarUrl,
    department: u.department ?? u.headline ?? "CampusMind learner",
  }));

  return {
    ...response,
    content: transformedUsers,
  };
};

function seedPublicCourseEntries(dispatch, pageData) {
  const courses = pageData?.content;
  if (!dispatch || !Array.isArray(courses)) return;
  courses.forEach((course) => {
    const courseId = course?.id || course?.courseId;
    if (courseId) {
      dispatch(
        exploreApi.util.upsertQueryData("getPublicCourse", courseId, {
          ...course,
          id: courseId,
          courseId,
          name: course.title ?? course.name ?? "Untitled course",
          title: course.title ?? course.name ?? "Untitled course",
        }),
      );
    }
  });
}

export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExploreFeed: builder.query({
      query: ({ subject, page = 0, size = 20 } = {}) => ({
        url: "/explore/feed",
        params: { ...(subject ? { subject } : {}), page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseFeed", id: "LIST" }],
      keepUnusedDataFor: 600,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          seedPublicCourseEntries(dispatch, data);
        } catch {
          // Ignore cache seeding errors
        }
      },
    }),
    searchExploreCourses: builder.query({
      query: ({ q, page = 0, size = 20 }) => ({
        url: "/explore/courses/search",
        params: { q: q.trim(), page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseSearch", id: "LIST" }],
      keepUnusedDataFor: 600,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          seedPublicCourseEntries(dispatch, data);
        } catch {
          // Ignore cache seeding errors
        }
      },
    }),
    getExploreRecommendations: builder.query({
      query: ({ page = 0, size = 20 } = {}) => ({
        url: "/explore/recommendations",
        params: { page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseRecommendations", id: "LIST" }],
      keepUnusedDataFor: 600,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          seedPublicCourseEntries(dispatch, data);
        } catch {
          // Ignore cache seeding errors
        }
      },
    }),
    getExplorePeopleRecommendations: builder.query({
      query: ({ page = 0, size = 20 } = {}) => ({
        url: "/explore/people/recommendations",
        params: { page, size },
      }),
      transformResponse: normalizePeoplePage,
      providesTags: [{ type: "Profile", id: "RECOMMENDATIONS" }],
      keepUnusedDataFor: 600,
    }),
    getPublicCourse: builder.query({
      query: (courseId) => `/explore/courses/${courseId}`,
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        return {
          ...payload,
          accessType: (
            payload?.accessType ||
            (payload?.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE")
          ).toUpperCase(),
        };
      },
      providesTags: (_res, _err, courseId) => [
        { type: "PublicCourse", id: courseId },
      ],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useGetExploreFeedQuery,
  useSearchExploreCoursesQuery,
  useGetExploreRecommendationsQuery,
  useGetExplorePeopleRecommendationsQuery,
  useGetPublicCourseQuery,
} = exploreApi;
