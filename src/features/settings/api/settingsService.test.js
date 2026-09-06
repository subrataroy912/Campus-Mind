import { beforeEach, describe, expect, it } from "vitest";
import { fetchTheme, updateTheme } from "./settingsService.js";

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

describe("settingsService", () => {
  it("loads the light theme by default", async () => {
    await expect(fetchTheme()).resolves.toBe("light");
  });

  it("persists and reloads a valid theme", async () => {
    await updateTheme("dark");

    await expect(fetchTheme()).resolves.toBe("dark");
  });

  it("rejects unsupported themes", async () => {
    await expect(updateTheme("sepia")).rejects.toThrow("Unsupported theme.");
  });
});
