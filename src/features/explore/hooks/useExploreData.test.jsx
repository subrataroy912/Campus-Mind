import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { useExploreData } from "./useExploreData.js";
import * as exploreApi from "../api/exploreApi.js";

vi.mock("../api/exploreApi.js", () => ({
  useGetExploreFeedQuery: vi.fn(),
  useSearchExploreCoursesQuery: vi.fn(),
  useGetExploreRecommendationsQuery: vi.fn(),
}));

function TestConsumer(props) {
  const result = useExploreData(props);
  return (
    <div data-testid="result">
      {JSON.stringify({
        classes: result.classes,
        status: result.status,
        isPlaceholderData: result.isPlaceholderData,
      })}
    </div>
  );
}

describe("useExploreData", () => {
  it("routes to search query when searchQuery is provided", () => {
    vi.mocked(exploreApi.useGetExploreFeedQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    vi.mocked(exploreApi.useSearchExploreCoursesQuery).mockReturnValue({
      data: { content: [{ courseId: "c-search-1" }] },
      isLoading: false,
    });
    vi.mocked(exploreApi.useGetExploreRecommendationsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const html = renderToString(
      <TestConsumer searchQuery="math" enabled={true} />
    );

    expect(html).toContain("c-search-1");
    expect(exploreApi.useSearchExploreCoursesQuery).toHaveBeenCalledWith(
      { q: "math", page: 0, size: 20 },
      { skip: false }
    );
    expect(exploreApi.useGetExploreFeedQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true }
    );
  });

  it("routes to recommendations when classFilter is 'recommended' and no search query", () => {
    vi.mocked(exploreApi.useGetExploreFeedQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    vi.mocked(exploreApi.useSearchExploreCoursesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    vi.mocked(exploreApi.useGetExploreRecommendationsQuery).mockReturnValue({
      data: { content: [{ courseId: "c-rec-1" }] },
      isLoading: false,
    });

    const html = renderToString(
      <TestConsumer classFilter="recommended" enabled={true} />
    );

    expect(html).toContain("c-rec-1");
    expect(exploreApi.useGetExploreRecommendationsQuery).toHaveBeenCalledWith(
      { page: 0, size: 20 },
      { skip: false }
    );
  });

  it("skips all queries when enabled is false", () => {
    vi.mocked(exploreApi.useGetExploreFeedQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    vi.mocked(exploreApi.useSearchExploreCoursesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    vi.mocked(exploreApi.useGetExploreRecommendationsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderToString(<TestConsumer enabled={false} />);

    expect(exploreApi.useGetExploreFeedQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true }
    );
    expect(exploreApi.useSearchExploreCoursesQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true }
    );
    expect(exploreApi.useGetExploreRecommendationsQuery).toHaveBeenCalledWith(
      expect.anything(),
      { skip: true }
    );
  });
});
