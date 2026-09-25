import { describe, expect, it } from "vitest";
import {
  INITIAL_SPACE_FORM,
  SUBJECTS,
} from "./createSpaceForm.js";
import { mapCreateClassPayload } from "../api/classroomService.js";

describe("createSpaceForm model", () => {
  it("initializes with empty customSubject and subject", () => {
    expect(INITIAL_SPACE_FORM.customSubject).toBe("");
    expect(INITIAL_SPACE_FORM.subject).toBe("");
    expect(INITIAL_SPACE_FORM.className).toBe("");
    expect(INITIAL_SPACE_FORM.accessType).toBe("PUBLIC");
  });

  it("includes 'Other' as a selectable option in SUBJECTS", () => {
    expect(SUBJECTS).toContain("Other");
  });

  it("correctly maps custom subject into create payload", () => {
    const effectiveSubject = "Robotics & Artificial Intelligence";

    const payload = mapCreateClassPayload({
      className: "Future Tech 101",
      section: "Lab 3",
      subject: effectiveSubject,
      accessType: "PUBLIC",
    });

    expect(payload).toMatchObject({
      title: "Future Tech 101",
      section: "Lab 3",
      subject: "Robotics & Artificial Intelligence",
      accessType: "PUBLIC",
    });
  });
});
