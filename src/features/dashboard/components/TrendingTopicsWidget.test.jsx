import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { TrendingTopicsWidget } from "./TrendingTopicsWidget.jsx";

describe("TrendingTopicsWidget", () => {
  it("renders trending hashtags and titles", () => {
    const html = renderToString(<TrendingTopicsWidget />);
    expect(html).toContain("Trending on Campus");
    expect(html).toContain("#FinalCapstone");
    expect(html).toContain("#Hackathon2026");
    expect(html).toContain("#AlgorithmsExam");
  });

  it("marks active selected topic", () => {
    const html = renderToString(<TrendingTopicsWidget activeTopic="#FinalCapstone" />);
    expect(html).toContain("bg-primary");
  });
});
