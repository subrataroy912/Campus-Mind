import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CampusLeaderboardWidget } from "./CampusLeaderboardWidget.jsx";

describe("CampusLeaderboardWidget", () => {
  it("renders weekly campus scholars heading and top ranks", () => {
    const html = renderToString(<CampusLeaderboardWidget />);
    expect(html).toContain("Weekly Campus Scholars");
    expect(html).toContain("Maya Lin");
    expect(html).toContain("Alex Rivera");
    expect(html).toContain("Your Rank: #14");
  });
});
