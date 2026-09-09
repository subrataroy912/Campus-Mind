import { describe, expect, it } from "vitest";
import { mapCreateClassPayload } from "./classroomService.js";

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
      }),
    ).toEqual({
      name: "Algebra II",
      section: "Period 3",
      subject: "Mathematics",
      gradeLevel: "Grade 10",
      room: "Room 204",
      description: "Advanced algebra",
      visibility: "PUBLIC",
    });
  });
});
