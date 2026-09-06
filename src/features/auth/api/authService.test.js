import { beforeEach, describe, expect, it } from "vitest";
import { updateProfile } from "./authService.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

beforeEach(() => {
  globalThis.window = { localStorage: createStorage() };
});

describe("authService profile persistence", () => {
  it("updates the stored user record and returns a session-safe user", async () => {
    const updatedUser = await updateProfile("demo-student", {
      name: "Updated Student",
      bio: "A new bio",
    });
    const storedUsers = JSON.parse(
      window.localStorage.getItem("campus-mind.mock-users"),
    );
    const storedUser = storedUsers.find((user) => user.id === "demo-student");

    expect(updatedUser.name).toBe("Updated Student");
    expect(updatedUser.password).toBeUndefined();
    expect(storedUser.name).toBe("Updated Student");
    expect(storedUser.bio).toBe("A new bio");
  });
});
