import { describe, expect, it } from "vitest";
import { getCourseNotFoundDetails } from "./classroomErrors.js";

describe("getCourseNotFoundDetails", () => {
  it("returns diagnostic details for a missing course", () => {
    expect(
      getCourseNotFoundDetails({ status: 404 }, "course-123")
    ).toMatchObject({
      courseId: "course-123",
      status: 404,
      url: expect.stringContaining("/courses/course-123"),
    });
  });

  it("ignores non-404 errors and missing course IDs", () => {
    expect(getCourseNotFoundDetails({ status: 401 }, "course-123")).toBeNull();
    expect(getCourseNotFoundDetails({ status: 404 }, "")).toBeNull();
  });
});
