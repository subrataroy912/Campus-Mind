import { beforeEach, describe, expect, it } from "vitest";
import {
  createClassroom,
  fetchClassrooms,
} from "./classroomService.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
}

beforeEach(() => {
  globalThis.window = { localStorage: createStorage() };
});

describe("classroomService", () => {
  it("keeps created classrooms scoped to the owning user", async () => {
    const created = await createClassroom("user-a", {
      className: "Biology",
      section: "Period 2",
      subject: "Science",
    });

    const userAClasses = await fetchClassrooms("user-a");
    const userBClasses = await fetchClassrooms("user-b");

    expect(userAClasses.some((classroom) => classroom.id === created.id)).toBe(true);
    expect(userBClasses.some((classroom) => classroom.id === created.id)).toBe(false);
  });

  it("falls back to fixtures when stored classroom data is malformed", async () => {
    window.localStorage.setItem("campus-mind.classrooms.user-a", "not-json");

    const classrooms = await fetchClassrooms("user-a");

    expect(classrooms.length).toBeGreaterThan(0);
  });
});
