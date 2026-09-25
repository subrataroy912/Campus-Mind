import { describe, expect, it } from "vitest";
import { filterAndSortPeople, matches } from "./peopleFilter.js";

describe("peopleFilter", () => {
  const currentUser = {
    id: "user-current",
    name: "Alice Current",
    handle: "alice",
    joined_class_ids: ["class-1", "class-2"],
  };

  const sampleUsers = [
    {
      id: "user-1",
      name: "Bob Unconnected",
      handle: "bob",
      joined_class_ids: [],
    },
    {
      id: "user-2",
      name: "Charlie Classmate",
      handle: "charlie",
      sharedCoursesCount: 1,
      recommendationReason: "SHARED_SPACES",
    },
    {
      id: "user-3",
      name: "Diana Dual",
      handle: "diana",
      sharedCoursesCount: 2,
      recommendationReason: "SHARED_SPACES",
    },
    {
      id: "user-4",
      name: "Aaron Mutual",
      handle: "aaron",
      mutualPeersCount: 2,
      recommendationReason: "MUTUAL_SPACE_PEERS",
    },
  ];

  it("matches case-insensitively", () => {
    expect(matches("Computer Science", "sci")).toBe(true);
    expect(matches("Alice", "BOB")).toBe(false);
  });

  it("returns only recommended users (shared spaces or mutual peers) sorted by score when filter is 'all'", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "all",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual([
      "user-3", // 2 shared spaces -> score 20
      "user-2", // 1 shared space -> score 10
      "user-4", // 2 mutual peers -> score 6
    ]);
  });

  it("filters by mutual space peers only when personFilter is 'mutual'", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "mutual",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-4"]);
  });

  it("filters by shared spaces only when personFilter is 'shared'", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "",
      personFilter: "shared",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-3", "user-2"]);
  });

  it("prepends current user when searchQuery matches current user", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "Alice",
      personFilter: "all",
      currentUser,
    });

    expect(result[0].id).toBe("user-current");
  });

  it("filters recommended users by searchQuery matching name or handle", () => {
    const result = filterAndSortPeople(sampleUsers, {
      searchQuery: "charlie",
      personFilter: "all",
      currentUser,
    });

    expect(result.map((u) => u.id)).toEqual(["user-2"]);
  });
});
