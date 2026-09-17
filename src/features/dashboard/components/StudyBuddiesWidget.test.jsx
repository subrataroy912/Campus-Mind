import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { StudyBuddiesWidget } from "./StudyBuddiesWidget.jsx";

describe("StudyBuddiesWidget", () => {
  it("renders suggested classmates heading and names", () => {
    const html = renderToString(<StudyBuddiesWidget />);
    expect(html).toContain("Study Buddies &amp; Classmates");
    expect(html).toContain("Sarah Jenkins");
    expect(html).toContain("Liam O&#x27;Connor");
    expect(html).toContain("Connect");
  });
});
