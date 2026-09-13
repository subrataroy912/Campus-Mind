import { useState } from "react";
import {
  useGetExploreFeedQuery,
  useGetExploreRecommendationsQuery,
  useSearchExploreCoursesQuery,
} from "../api/exploreApi.js";

/**
 * Selects the API endpoint without ever turning an empty search into a feed.
 * The API requires a nonblank q, while subject filtering belongs to the feed.
 * Retains previous data when keepPreviousData is true to prevent UI flickering.
 */
export function useExploreData({
  searchQuery = "",
  classFilter = "all",
  page = 0,
  keepPreviousData = true,
} = {}) {
  const q = searchQuery.trim();
  const subject =
    !q && !["all", "popular", "recommended"].includes(classFilter)
      ? classFilter
      : undefined;
  const feed = useGetExploreFeedQuery(
    { subject, page, size: 20 },
    { skip: Boolean(q) || classFilter === "recommended" }
  );
  const search = useSearchExploreCoursesQuery(
    { q, page, size: 20 },
    { skip: !q }
  );
  const recommendations = useGetExploreRecommendationsQuery(
    { page, size: 20 },
    {
      skip: Boolean(q) || classFilter !== "recommended",
    }
  );
  const active = q
    ? search
    : classFilter === "recommended"
    ? recommendations
    : feed;

  const [previousData, setPreviousData] = useState(active.data);

  if (active.data && active.data !== previousData) {
    setPreviousData(active.data);
  }

  const isPlaceholderData =
    Boolean(keepPreviousData) && !active.data && Boolean(previousData);
  const resolvedData =
    active.data ?? (keepPreviousData ? previousData : undefined);

  return {
    classes: resolvedData?.content ?? [],
    page: resolvedData,
    query: active,
    isPlaceholderData,
    isFetching: active.isFetching,
    status:
      active.isLoading && !resolvedData
        ? "loading"
        : active.isError && !resolvedData
        ? "error"
        : "ready",
  };
}
