import { describe, expect, it } from "vitest";
import { isTeacherRole } from "./roles.js";

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
