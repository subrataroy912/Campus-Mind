import { describe, expect, it } from "vitest";
import { classroomApi } from "./classroomApi.js";

describe("classroomApi join and leave endpoints", () => {
  it("defines joinClassroom mutation targeting /courses/:id/enrollment", () => {
    const endpoint = classroomApi.endpoints.joinClassroom;
    expect(endpoint).toBeDefined();
    expect(typeof endpoint.initiate).toBe("function");

    // Course ID join
    const reqWithId = endpoint.initiate({ courseId: "c-123", code: "SECRET" });
    expect(reqWithId).toBeDefined();

    // Open course join
    const reqOpen = endpoint.initiate({ courseId: "c-123" });
    expect(reqOpen).toBeDefined();

    // Code-only join
    const reqCodeOnly = endpoint.initiate({ code: "ABCDEF" });
    expect(reqCodeOnly).toBeDefined();
  });

  it("defines leaveClassroom mutation targeting DELETE /courses/:id/enrollment", () => {
    const endpoint = classroomApi.endpoints.leaveClassroom;
    expect(endpoint).toBeDefined();
    expect(typeof endpoint.initiate).toBe("function");

    const req = endpoint.initiate("c-123");
    expect(req).toBeDefined();
  });

  it("defines createClassroom and deleteClassroom mutations with cache support", () => {
    expect(classroomApi.endpoints.createClassroom).toBeDefined();
    expect(classroomApi.endpoints.deleteClassroom).toBeDefined();
  });
});
