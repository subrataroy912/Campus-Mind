import { describe, expect, it } from "vitest";
import {
  mapCreateClassPayload,
  mapJoinClassPayload,
} from "./classroomService.js";

describe("mapCreateClassPayload", () => {
  it("maps the form values to the backend course contract", () => {
    expect(
      mapCreateClassPayload({
        className: "Algebra II",
        section: "Period 3",
        subject: "Mathematics",
        gradeLevel: "Grade 10",
        room: "Room 204",
        description: "Advanced algebra",
        accessType: "open",
      })
    ).toEqual({
      title: "Algebra II",
      section: "Period 3",
      subject: "Mathematics",
      description: "Advanced algebra",
      visibility: "PUBLIC",
      coverUrl: null,
    });
  });

  it("formats the course enrollment payload for the backend", () => {
    expect(
      mapJoinClassPayload({ courseId: "course-123", code: "abcd efgh" })
    ).toEqual({
      courseId: "course-123",
      code: "ABCD-EFGH",
    });
  });
});
