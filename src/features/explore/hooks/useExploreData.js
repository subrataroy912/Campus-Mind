import {
  useGetExploreFeedQuery,
  useGetExploreRecommendationsQuery,
  useSearchExploreCoursesQuery,
} from "../api/exploreApi.js";

/**
 * Selects the API endpoint without ever turning an empty search into a feed.
 * The API requires a nonblank q, while subject filtering belongs to the feed.
 */
export function useExploreData({ searchQuery = "", classFilter = "all", page = 0 } = {}) {
  const q = searchQuery.trim();
  const subject = !q && !["all", "popular", "recommended"].includes(classFilter)
    ? classFilter
    : undefined;
  const feed = useGetExploreFeedQuery({ subject, page, size: 20 }, { skip: Boolean(q) || classFilter === "recommended" });
  const search = useSearchExploreCoursesQuery({ q, page, size: 20 }, { skip: !q });
  const recommendations = useGetExploreRecommendationsQuery({ page, size: 20 }, {
    skip: Boolean(q) || classFilter !== "recommended",
  });
  const active = q ? search : classFilter === "recommended" ? recommendations : feed;

  return {
    classes: active.data?.content ?? [],
    page: active.data,
    status: active.isLoading || active.isFetching ? "loading" : active.isError ? "error" : "ready",
  };
}
