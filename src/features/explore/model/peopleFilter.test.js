import { describe, expect, it } from "vitest";
import { filterAndSortPeople, matches } from "./peopleFilter.js";

describe("peopleFilter", () => {
  const currentUser = {
    id: "user-current",
    name: "Alice Current",
    handle: "alice",
    department: "Computer Science",
    joined_class_ids: ["class-1", "class-2"],
  };

  const sampleUsers = [
    {
      id: "user-1",
      name: "Bob Builder",
      handle: "bob",
      department: "Civil Engineering",
      joined_class_ids: [],
    },
    {
      id: "user-2",
      name: "Charlie CS",
      handle: "charlie",
      department: "Computer Science",
      joined_class_ids: ["class-1"], // 1 shared class
    },
    {
      id: "user-3",
      name: "Diana Dual",
      handle: "diana",
      department: "Mathematics",
      joined_class_ids: ["class-1", "class-2"], // 2 shared classes
    },
    {
      id: "user-4",
      name: "Aaron CS",
      handle: "aaron",
      department: "Computer Science",
      joined_class_ids: [], // 0 shared, CS
    },
  ];

  it("matches case-insensitively", () => {
    expect(matches("Computer Science", "sci")).toBe(true);
    expect(matches("Alice", "BOB")).toBe(false);
  });

  it("returns all users sorted by shared classes, then same department, then name when filter is 'all'", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "all",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual([
      "user-3", // 2 shared classes
      "user-2", // 1 shared class
      "user-4", // 0 shared, same dept (CS), name "Aaron"
      "user-1", // 0 shared, different dept (Civil)
    ]);
  });

  it("filters by shared classes only when personFilter is 'shared'", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "shared",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-3", "user-2"]);
  });

  it("filters by department when personFilter is a department name", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "Computer Science",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-2", "user-4"]);
  });

  it("prepends current user when searchQuery matches current user", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "Alice",
      personFilter: "all",
      currentUser,
    });

    expect(result[0].id).toBe("user-current");
  });

  it("filters users by searchQuery matching name, handle, or department", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "builder",
      personFilter: "all",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-1"]);
  });

  it("filters and ranks users when personFilter is 'recommended'", () => {
    const recommendedUsers = [
      {
        id: "user-rec-1",
        name: "Zachary Peer",
        sharedCoursesCount: 3,
        sameDepartment: true,
      },
      {
        id: "user-rec-2",
        name: "Aaron Creator",
        canCreateCourses: true,
        recommendationReason: "FEATURED_CREATOR",
      },
      {
        id: "user-rec-3",
        name: "Bob Plain",
      },
    ];

    const result = filterAndSortPeople(recommendedUsers, {
      searchQuery: "",
      personFilter: "recommended",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-rec-1", "user-rec-2"]);
  });
});
