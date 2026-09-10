import { baseApi } from "@/app/baseApi.js";

const normalizeDiscoveryCourse = (course = {}) => ({
  ...course,
  id: course.courseId ?? course.id,
  courseId: course.courseId ?? course.id,
  title: course.title ?? "Untitled course",
  subtitle: course.tags?.join(" · ") ?? "",
  tags: Array.isArray(course.tags) ? course.tags : [],
  memberCount: course.enrollmentCount ?? 0,
  popularity: course.popularityScore ?? 0,
  lastActivityAt: course.lastActivityAt ?? null,
  theme: "bg-primary",
});

export const normalizeDiscoveryPage = (response = {}) => {
  const page = response?.data ?? response;
  return { ...page, content: (page?.content ?? []).map(normalizeDiscoveryCourse) };
};

/** Public feed/search retain PageResponse metadata; recommendations are signed in. */
export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExploreFeed: builder.query({
      query: ({ subject, page = 0, size = 20 } = {}) => ({
        url: "/explore/feed", params: { ...(subject ? { subject } : {}), page, size },
      }),
      transformResponse: normalizeDiscoveryPage,
    }),
    searchExploreCourses: builder.query({
      query: ({ q, page = 0, size = 20 }) => ({ url: "/explore/courses/search", params: { q, page, size } }),
      transformResponse: normalizeDiscoveryPage,
    }),
    getExploreRecommendations: builder.query({
      query: ({ page = 0, size = 20 } = {}) => ({ url: "/explore/recommendations", params: { page, size } }),
      transformResponse: normalizeDiscoveryPage,
    }),
  }),
});

export const { useGetExploreFeedQuery, useSearchExploreCoursesQuery, useGetExploreRecommendationsQuery } = exploreApi;
