import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CampusStoriesBar } from "./CampusStoriesBar.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { name: "Test Student", avatar: null },
  }),
}));

describe("CampusStoriesBar", () => {
  it("renders Add Story button", () => {
    const html = renderToString(<CampusStoriesBar />);
    expect(html).toContain("Add Story");
    expect(html).toContain("Add your campus story");
  });

  it("renders community story bubbles", () => {
    const html = renderToString(<CampusStoriesBar />);
    expect(html).toContain("Hackathon Lead");
    expect(html).toContain("Main Library");
    expect(html).toContain("Robotics Club");
  });
});
