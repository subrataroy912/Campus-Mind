import { describe, expect, it } from "vitest";
import { normalizeDiscoveryPage } from "./exploreApi.js";

describe("normalizeDiscoveryPage", () => {
  it("preserves paging metadata and the backend discovery response shape", () => {
    expect(
      normalizeDiscoveryPage({
        content: [
          {
            courseId: "course-1",
            title: "Calculus I",
            subject: "Mathematics",
            tags: ["limits", "derivatives"],
            enrollmentCount: 24,
            popularityScore: 9.5,
          },
        ],
        page: 0,
        size: 20,
        totalElements: 1,
      })
    ).toMatchObject({
      page: 0,
      totalElements: 1,
      content: [
        {
          courseId: "course-1",
          subject: "Mathematics",
          tags: ["limits", "derivatives"],
          enrollmentCount: 24,
          popularityScore: 9.5,
        },
      ],
    });
  });
});
