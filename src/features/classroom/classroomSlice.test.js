import { describe, expect, it } from "vitest";
import classroomReducer, { clearClassroomState, setClassroomTab } from "./classroomSlice.js";

describe("classroomSlice", () => {
  it("updates the active classroom tab", () => {
    const first = classroomReducer(undefined, setClassroomTab("members"));
    expect(first.activeTab).toBe("members");
  });

  it("resets the classroom state", () => {
    const state = classroomReducer(undefined, setClassroomTab("grades"));
    const reset = classroomReducer(state, clearClassroomState());
    expect(reset.activeTab).toBe("home");
  });
});
