import { describe, expect, it } from "vitest";
import { isTeacherRole, isUserEnrolled } from "./roles.js";

describe("isTeacherRole", () => {
  it.each(["created", "Created", " teacher ", "OWNER", "Owner"])(
    "accepts teacher role variant %s",
    (role) => {
      expect(isTeacherRole(role)).toBe(true);
    }
  );

  it.each(["student", "joined", "co-teacher", "admin", "", null, undefined])(
    "rejects non-teacher role %s",
    (role) => {
      expect(isTeacherRole(role)).toBe(false);
    }
  );
});

describe("isUserEnrolled", () => {
  it("returns true when isEnrolled or enrolled is true", () => {
    expect(isUserEnrolled({ isEnrolled: true })).toBe(true);
    expect(isUserEnrolled({ enrolled: true })).toBe(true);
  });

  it("returns false when isEnrolled or enrolled is explicitly false or role is VIEWER", () => {
    expect(isUserEnrolled({ isEnrolled: false })).toBe(false);
    expect(isUserEnrolled({ enrolled: false })).toBe(false);
    expect(isUserEnrolled({ role: "VIEWER" })).toBe(false);
  });

  it("returns true when user is owner, teacher, or creator", () => {
    expect(isUserEnrolled({ ownerId: "u1" }, "u1")).toBe(true);
    expect(isUserEnrolled({ teacherId: "u2" }, "u2")).toBe(true);
    expect(isUserEnrolled({ creatorId: "u3" }, "u3")).toBe(true);
  });

  it("returns false for missing or non-matching user without valid role", () => {
    expect(isUserEnrolled(null, "u1")).toBe(false);
    expect(isUserEnrolled({}, "u1")).toBe(false);
  });
});
