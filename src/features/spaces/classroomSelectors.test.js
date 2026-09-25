import { describe, expect, it } from "vitest";
import {
  selectClassroomsData,
  selectCreatedSpaces,
  selectJoinedSpaces,
  selectEnrolledCourseIds,
} from "./classroomSelectors.js";

describe("classroomSelectors", () => {
  const mockState = {
    baseApi: {
      queries: {
        'fetchClassrooms(undefined)': {
          status: "fulfilled",
          data: [
            { id: "c-1", title: "My Space", role: "OWNER", ownerId: "user-1" },
            { id: "c-2", title: "Peer Space", role: "MEMBER", ownerId: "user-2" },
            { id: "c-3", title: "Lab Space", role: "CREATED", ownerId: "user-1" },
          ],
        },
      },
    },
  };

  it("extracts classrooms array from RTK Query cache", () => {
    const classrooms = selectClassroomsData(mockState);
    expect(classrooms).toHaveLength(3);
    expect(classrooms[0].id).toBe("c-1");
  });

  it("selects created spaces memoized for given userId", () => {
    const created = selectCreatedSpaces(mockState, "user-1");
    expect(created).toHaveLength(2);
    expect(created.map((c) => c.id)).toEqual(["c-1", "c-3"]);
  });

  it("selects joined spaces memoized for given userId", () => {
    const joined = selectJoinedSpaces(mockState, "user-1");
    expect(joined).toHaveLength(1);
    expect(joined[0].id).toBe("c-2");
  });

  it("creates a memoized Set of enrolled course IDs", () => {
    const ids = selectEnrolledCourseIds(mockState);
    expect(ids).toBeInstanceOf(Set);
    expect(ids.has("c-1")).toBe(true);
    expect(ids.has("c-2")).toBe(true);
    expect(ids.has("c-3")).toBe(true);
    expect(ids.has("c-999")).toBe(false);
  });

  it("returns fallback empty array / set for empty state", () => {
    const emptyState = { baseApi: { queries: {} } };
    expect(selectClassroomsData(emptyState)).toEqual([]);
    expect(selectCreatedSpaces(emptyState, "user-1")).toEqual([]);
    expect(selectJoinedSpaces(emptyState, "user-1")).toEqual([]);
    expect(selectEnrolledCourseIds(emptyState).size).toBe(0);
  });
});
