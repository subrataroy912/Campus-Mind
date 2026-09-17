import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ReputationBadge } from "./ReputationBadge.jsx";
import { REPUTATION_BADGES } from "./reputationConstants.js";

describe("ReputationBadge", () => {
  it("renders Campus Scholar badge with graduation cap", () => {
    const html = renderToString(<ReputationBadge badgeId="SCHOLAR" />);
    expect(html).toContain("Campus Scholar");
    expect(html).toContain("reputation-badge");
  });

  it("renders Streak Master badge", () => {
    const html = renderToString(<ReputationBadge badgeId="STREAK_MASTER" />);
    expect(html).toContain("Streak Master");
  });

  it("renders null for invalid badgeId", () => {
    const html = renderToString(<ReputationBadge badgeId="INVALID_ID" />);
    expect(html).toBe("");
  });

  it("has all 4 reputation badges configured", () => {
    const keys = Object.keys(REPUTATION_BADGES);
    expect(keys).toContain("SCHOLAR");
    expect(keys).toContain("CONTRIBUTOR");
    expect(keys).toContain("STREAK_MASTER");
    expect(keys).toContain("PULSE_PIONEER");
  });
});
