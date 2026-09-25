import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import SpacePostBox from "./SpacePostBox.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: {
      id: "u-123",
      name: "Alex Morgan",
      avatarUrl: "https://example.com/alex.png",
    },
  }),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("SpacePostBox", () => {
  it("hydrates current user avatar and name instead of placeholder 'You'", () => {
    const html = renderToString(<SpacePostBox onSubmit={vi.fn()} />);

    // Should contain current user's avatar
    expect(html).toContain("https://example.com/alex.png");
    expect(html).toContain("Alex Morgan");
    // Should have attach and video/link buttons
    expect(html).toContain("Attach");
    expect(html).toContain("Video / Link");
    // Should not have dead poll button
    expect(html).not.toContain("Poll");
  });
});
