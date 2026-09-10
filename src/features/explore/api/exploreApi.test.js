import { describe, expect, it } from "vitest";
import { normalizeDiscoveryPage } from "./exploreApi.js";

describe("normalizeDiscoveryPage", () => {
  it("preserves paging metadata and adapts discovery summaries for course cards", () => {
    expect(normalizeDiscoveryPage({
      content: [{
        courseId: "course-1",
        title: "Calculus I",
        subject: "Mathematics",
        tags: ["limits", "derivatives"],
        enrollmentCount: 24,
        popularityScore: 9.5,
      }],
      page: 0,
      size: 20,
      totalElements: 1,
    })).toMatchObject({
      page: 0,
      totalElements: 1,
      content: [{
        id: "course-1",
        subtitle: "limits · derivatives",
        memberCount: 24,
        popularity: 9.5,
      }],
    });
  });
});
