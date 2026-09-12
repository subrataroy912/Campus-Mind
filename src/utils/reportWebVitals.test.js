import { describe, expect, it, vi } from "vitest";
import { reportWebVitals } from "./reportWebVitals.js";

vi.mock("web-vitals", () => ({
  onCLS: vi.fn((cb) => cb({ name: "CLS", value: 0.05, rating: "good" })),
  onINP: vi.fn((cb) => cb({ name: "INP", value: 50, rating: "good" })),
  onLCP: vi.fn((cb) => cb({ name: "LCP", value: 1200, rating: "good" })),
  onFCP: vi.fn((cb) => cb({ name: "FCP", value: 800, rating: "good" })),
  onTTFB: vi.fn((cb) => cb({ name: "TTFB", value: 200, rating: "good" })),
}));

describe("reportWebVitals", () => {
  it("invokes web-vitals collectors with custom callback", async () => {
    const callback = vi.fn();
    reportWebVitals(callback);

    // Allow dynamic import promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ name: "CLS", value: 0.05, rating: "good" })
    );
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ name: "LCP", value: 1200, rating: "good" })
    );
  });

  it("logs metrics when no callback is provided", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    reportWebVitals();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vitals] CLS: 0ms (good)")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vitals] LCP: 1200ms (good)")
    );
    spy.mockRestore();
  });
});
