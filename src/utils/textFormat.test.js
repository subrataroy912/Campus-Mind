import { describe, expect, it } from "vitest";
import { formatDisplayText } from "./textFormat.js";

describe("formatDisplayText", () => {
  it("formats known account type enums into title case", () => {
    expect(formatDisplayText("STUDENT")).toBe("Student");
    expect(formatDisplayText("TEACHER")).toBe("Teacher");
    expect(formatDisplayText("ADMIN")).toBe("Admin");
  });

  it("formats privacy enums properly", () => {
    expect(formatDisplayText("PRIVATE")).toBe("Private");
    expect(formatDisplayText("PUBLIC")).toBe("Public");
    expect(formatDisplayText("COURSE_MEMBERS")).toBe("Course Members");
  });

  it("formats general uppercase or snake case strings into readable title case", () => {
    expect(formatDisplayText("COMPUTER_SCIENCE")).toBe("Computer Science");
    expect(formatDisplayText("MATHEMATICS")).toBe("Mathematics");
  });

  it("handles null, undefined, or empty values safely", () => {
    expect(formatDisplayText(null)).toBe("");
    expect(formatDisplayText(undefined)).toBe("");
    expect(formatDisplayText("")).toBe("");
  });
});
