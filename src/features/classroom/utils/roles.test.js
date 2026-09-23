import { describe, expect, it } from "vitest";
import { isStaffRole, isUserEnrolled } from "./roles.js";

describe("isStaffRole", () => {
  it.each(["created", "Created", "ADMIN", "admin", "OWNER", "Owner"])(
    "accepts staff role variant %s",
    (role) => {
      expect(isStaffRole(role)).toBe(true);
    }
  );

  it.each(["member", "student", "joined", "viewer", "", null, undefined])(
    "rejects non-staff role %s",
    (role) => {
      expect(isStaffRole(role)).toBe(false);
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

  it("returns true when user is owner or creator", () => {
    expect(isUserEnrolled({ ownerId: "u1" }, "u1")).toBe(true);
    expect(isUserEnrolled({ creatorId: "u3" }, "u3")).toBe(true);
  });

  it("returns false for missing or non-matching user without valid role", () => {
    expect(isUserEnrolled(null, "u1")).toBe(false);
    expect(isUserEnrolled({}, "u1")).toBe(false);
  });
});
