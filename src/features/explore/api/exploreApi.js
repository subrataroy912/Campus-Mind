import { baseApi } from "@/app/baseApi.js";

const normalizeDiscoveryCourse = (course = {}) => ({
  courseId: course.courseId,
  id: course.courseId,
  title: course.title ?? "Untitled course",
  subject: course.subject ?? "",
  tags: Array.isArray(course.tags) ? course.tags : [],
  enrollmentCount: course.enrollmentCount ?? 0,
  popularityScore: course.popularityScore ?? 0,
  lastActivityAt: course.lastActivityAt ?? null,
  accessType: (course.accessType || "OPEN").toUpperCase(),
});

export const normalizeDiscoveryPage = (response = {}) => {
  const page = response?.data ?? response;
  return {
    ...page,
    content: (page?.content ?? []).map(normalizeDiscoveryCourse),
  };
};

/** Public feed/search retain PageResponse metadata; recommendations are signed in. */
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
      query: () => ({
        url: "/users",
      }),
      transformResponse: (response) => {
        const payload = response?.data ?? response;
        const users = Array.isArray(payload) ? payload : [];
        return users.map((u) => ({
          ...u,
          id: u.id ?? u.userId,
          name:
            u.name ||
            u.displayName ||
            ([u.firstName, u.lastName].filter(Boolean).join(" ") ||
              "CampusMind member"),
          avatar: u.avatar ?? u.avatarUrl,
          department:
            u.department ?? u.headline ?? "CampusMind learner",
        }));
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
            (payload?.visibility === "PUBLIC" ? "OPEN" : "CODE")
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
