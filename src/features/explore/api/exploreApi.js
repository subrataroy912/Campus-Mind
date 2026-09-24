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

export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExploreFeed: builder.query({
      query: ({ subject, page = 0, size = 20 } = {}) => ({
        url: "/explore/feed",
        params: { ...(subject ? { subject } : {}), page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseFeed", id: "LIST" }],
    }),
    searchExploreCourses: builder.query({
      query: ({ q, page = 0, size = 20 }) => ({
        url: "/explore/courses/search",
        params: { q: q.trim(), page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseSearch", id: "LIST" }],
    }),
    getExploreRecommendations: builder.query({
      query: ({ page = 0, size = 20 } = {}) => ({
        url: "/explore/recommendations",
        params: { page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
      providesTags: [{ type: "CourseRecommendations", id: "LIST" }],
    }),
    getExplorePeople: builder.query({
      query: ({ page = 0, size = 20, q = "" } = {}) => ({
        url: "/users",
        params: {
          page,
          size,
          ...(q ? { q } : {}),
        },
      }),

      transformResponse: (response) => {
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
      },

      providesTags: [{ type: "Profile", id: "LIST" }],
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
    }),
  }),
});

export const {
  useGetExploreFeedQuery,
  useSearchExploreCoursesQuery,
  useGetExploreRecommendationsQuery,
  useGetExplorePeopleQuery,
  useGetPublicCourseQuery,
} = exploreApi;
