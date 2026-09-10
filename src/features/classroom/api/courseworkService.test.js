import { describe, expect, it } from "vitest";
import { mapCourseworkPayload, normalizeSubmission } from "./courseworkService.js";

describe("mapCourseworkPayload", () => {
  it("maps the frontend form to the backend course work contract", () => {
    expect(
      mapCourseworkPayload({
        title: "Homework set 4",
        description: "Complete problems 1–24",
        type: "ASSIGNMENT",
        dueAt: "2026-09-10T17:00:00Z",
        maximumPoints: 20,
      }),
    ).toEqual({
      title: "Homework set 4",
      description: "Complete problems 1–24",
      type: "ASSIGNMENT",
      dueAt: "2026-09-10T17:00:00Z",
      maximumPoints: 20,
    });
  });
});

describe("normalizeSubmission", () => {
  it("normalizes teacher and student submission payloads", () => {
    expect(
      normalizeSubmission({
        id: "submission-1",
        status: "submitted",
        submittedAt: "2026-09-08T12:00:00Z",
        score: 18,
        submitted: true,
      }),
    ).toEqual({
      id: "submission-1",
      status: "submitted",
      submittedAt: "2026-09-08T12:00:00Z",
      score: 18,
      submitted: true,
    });
  });
});
