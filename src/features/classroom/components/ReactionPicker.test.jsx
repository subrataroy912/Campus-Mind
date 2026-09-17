import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ReactionPicker } from "./ReactionPicker.jsx";
import { REACTIONS } from "./reactionConstants.js";

describe("ReactionPicker", () => {
  it("renders default react trigger button", () => {
    const html = renderToString(<ReactionPicker />);
    expect(html).toContain("React");
  });

  it("renders active user reaction emoji and label when selected", () => {
    const html = renderToString(<ReactionPicker userReaction="FIRE" />);
    expect(html).toContain("Fire");
    expect(html).toContain("🔥");
  });

  it("has metadata for all defined reactions", () => {
    expect(REACTIONS.length).toBe(5);
    const ids = REACTIONS.map((r) => r.id);
    expect(ids).toContain("LOVE");
    expect(ids).toContain("FIRE");
    expect(ids).toContain("BRILLIANT");
    expect(ids).toContain("RESPECT");
    expect(ids).toContain("SPOT_ON");
  });
});
