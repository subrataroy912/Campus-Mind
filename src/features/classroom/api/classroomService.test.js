import { describe, expect, it } from "vitest";
import {
  mapCreateClassPayload,
  mapJoinClassPayload,
} from "./classroomService.js";

describe("mapCreateClassPayload", () => {
  it("maps the form values to the backend course contract with accessType", () => {
    expect(
      mapCreateClassPayload({
        className: "Algebra II",
        section: "Period 3",
        subject: "Mathematics",
        gradeLevel: "Grade 10",
        room: "Room 204",
        description: "Advanced algebra",
        accessType: "open",
        theme: "indigo",
      })
    ).toEqual({
      title: "Algebra II",
      section: "Period 3",
      subject: "Mathematics",
      description: "Advanced algebra",
      coverUrl: null,
      logoUrl: null,
      theme: "indigo",
      accessType: "OPEN",
      visibility: "PUBLIC",
    });

    expect(
      mapCreateClassPayload({
        className: "Biology Honors",
        accessType: "invite",
      })
    ).toEqual({
      title: "Biology Honors",
      section: "",
      subject: "",
      description: "",
      coverUrl: null,
      logoUrl: null,
      theme: null,
      accessType: "INVITE",
      visibility: "PRIVATE",
    });

    expect(
      mapCreateClassPayload({
        className: "Chemistry 101",
        accessType: "code",
      })
    ).toEqual({
      title: "Chemistry 101",
      section: "",
      subject: "",
      description: "",
      coverUrl: null,
      logoUrl: null,
      theme: null,
      accessType: "CODE",
      visibility: "PRIVATE",
    });
  });

  it("formats the course enrollment payload for the backend", () => {
    expect(
      mapJoinClassPayload({ courseId: "course-123", code: "abcd efgh" })
    ).toEqual({
      courseId: "course-123",
      code: "ABCDEFGH",
    });

    expect(
      mapJoinClassPayload({ courseId: "course-open-direct" })
    ).toEqual({
      courseId: "course-open-direct",
    });

    expect(
      mapJoinClassPayload({ courseId: "6aa4583ab463bdd7707f1556", code: "" })
    ).toEqual({
      courseId: "6aa4583ab463bdd7707f1556",
    });

    expect(
      mapJoinClassPayload({ code: "ABCDEFGH" })
    ).toEqual({
      code: "ABCDEFGH",
    });
  });
});
