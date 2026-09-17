import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { DailyStreakBadge } from "./DailyStreakBadge.jsx";

describe("DailyStreakBadge", () => {
  it("renders flame streak trigger button", () => {
    const html = renderToString(<DailyStreakBadge />);
    expect(html).toContain("Daily Streak:");
    expect(html).toContain("button");
  });
});
