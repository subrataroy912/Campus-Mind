import { describe, expect, it } from "vitest";
import { normalizeComment } from "./commentService.js";

describe("normalizeComment", () => {
  it("normalizes backend comment payloads into a UI-safe structure", () => {
    expect(
      normalizeComment({
        id: "comment-1",
        content: "Nice work on this assignment.",
        author: { name: "Ms. Patel" },
        createdAt: "2026-09-08T10:30:00Z",
      }),
    ).toEqual({
      id: "comment-1",
      content: "Nice work on this assignment.",
      author: { name: "Ms. Patel" },
      createdAt: "2026-09-08T10:30:00Z",
    });
  });
});
