import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { FeedTabsNav } from "./FeedTabsNav.jsx";
import { FEED_TABS, CONTENT_FILTERS } from "./feedNavConstants.js";

describe("FeedTabsNav", () => {
  it("renders primary discovery tabs (For You, My Spaces, Campus Buzz)", () => {
    const html = renderToString(<FeedTabsNav activeTab="for-you" />);
    expect(html).toContain("For You");
    expect(html).toContain("My Spaces");
    expect(html).toContain("Campus Buzz");
  });

  it("renders all content filter buttons", () => {
    const html = renderToString(<FeedTabsNav activeTab="for-you" activeFilter="all" />);
    expect(html).toContain("All Posts");
    expect(html).toContain("Questions");
    expect(html).toContain("Discussions");
    expect(html).toContain("Polls");
    expect(html).toContain("Announcements");
  });

  it("has consistent configured tabs and filters", () => {
    expect(FEED_TABS.length).toBe(3);
    expect(CONTENT_FILTERS.length).toBe(5);
  });
});
