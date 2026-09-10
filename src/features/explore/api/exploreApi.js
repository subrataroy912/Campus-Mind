import { baseApi } from "@/app/baseApi.js";

/** Protected discovery endpoints retain PageResponse metadata for pagination UI. */
export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExploreFeed: builder.query({
      query: ({ subject, page = 0, size = 20 } = {}) => ({
        url: "/explore/feed", params: { ...(subject ? { subject } : {}), page, size },
      }),
    }),
    searchExploreCourses: builder.query({
      query: ({ q, page = 0, size = 20 }) => ({ url: "/explore/courses/search", params: { q, page, size } }),
    }),
    getExploreRecommendations: builder.query({
      query: ({ page = 0, size = 20 } = {}) => ({ url: "/explore/recommendations", params: { page, size } }),
    }),
  }),
});

export const { useGetExploreFeedQuery, useSearchExploreCoursesQuery, useGetExploreRecommendationsQuery } = exploreApi;
