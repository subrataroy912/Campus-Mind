import { describe, expect, it } from "vitest";
import {
  GRADE_LEVELS,
  INITIAL_CLASS_FORM,
  SUBJECTS,
} from "./model/createClassForm.js";
import { mapCreateClassPayload } from "./api/classroomService.js";

describe("createClassForm model", () => {
  it("initializes with empty customSubject and customGradeLevel", () => {
    expect(INITIAL_CLASS_FORM.customSubject).toBe("");
    expect(INITIAL_CLASS_FORM.customGradeLevel).toBe("");
    expect(INITIAL_CLASS_FORM.subject).toBe("");
    expect(INITIAL_CLASS_FORM.gradeLevel).toBe("");
  });

  it("includes 'Other' as a selectable option in SUBJECTS and GRADE_LEVELS", () => {
    expect(SUBJECTS).toContain("Other");
    expect(GRADE_LEVELS).toContain("Other");
  });

  it("correctly maps custom subject and grade into create payload", () => {
    const effectiveSubject = "Robotics & Artificial Intelligence";
    const effectiveGrade = "Advanced High School";

    const payload = mapCreateClassPayload({
      className: "Future Tech 101",
      section: "Lab 3",
      subject: effectiveSubject,
      gradeLevel: effectiveGrade,
      accessType: "code",
    });

    expect(payload).toMatchObject({
      title: "Future Tech 101",
      section: "Lab 3",
      subject: "Robotics & Artificial Intelligence",
      accessType: "CODE",
    });
  });
});
