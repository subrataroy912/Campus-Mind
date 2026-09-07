import { afterEach, describe, expect, it, vi } from "vitest";
import { mockUsers } from "@/mock/mockUsers.js";
import { fetchExploreUsers } from "./exploreService.js";

const storage = new Map();

vi.stubGlobal("window", {
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});

afterEach(() => storage.clear());

describe("fetchExploreUsers", () => {
  it("merges registered accounts, dedupes ids, excludes self, and filters opted-out users", async () => {
    storage.set("campus-mind.mock-users", JSON.stringify([
      { ...mockUsers[0], name: "Updated Campus Community" },
      { id: "registered-user", name: "New member", privacy: { discoverable: true } },
      { id: "private-user", name: "Private member", privacy: { discoverable: false } },
    ]));

    const users = await fetchExploreUsers(mockUsers[1].id);

    expect(users).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: mockUsers[0].id, name: "Updated Campus Community" }),
      expect.objectContaining({ id: "registered-user" }),
    ]));
    expect(users.filter((user) => user.id === mockUsers[0].id)).toHaveLength(1);
    expect(users.map((user) => user.id)).not.toContain(mockUsers[1].id);
    expect(users.map((user) => user.id)).not.toContain("private-user");
    expect(users.map((user) => user.id)).not.toContain("usr_55193hfskw2");
  });
});
