import { beforeEach, describe, expect, it } from "vitest";
import {
  fetchSettings,
  fetchTheme,
  updateSettings,
  updateTheme,
} from "./settingsService.js";

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

  it("loads the default notification and privacy preferences", async () => {
    await expect(fetchSettings()).resolves.toMatchObject({
      notifications: {
        classAnnouncements: true,
        directMessages: true,
        assignmentReminders: true,
        weeklyDigest: false,
      },
      privacy: {
        discoverable: true,
        showOnlineStatus: true,
      },
    });
  });

  it("persists and reloads notification and privacy preferences", async () => {
    await updateSettings({
      notifications: { classAnnouncements: false, directMessages: true, assignmentReminders: false, weeklyDigest: true },
      privacy: { discoverable: false, showOnlineStatus: true },
    });

    await expect(fetchSettings()).resolves.toMatchObject({
      notifications: {
        classAnnouncements: false,
        directMessages: true,
        assignmentReminders: false,
        weeklyDigest: true,
      },
      privacy: {
        discoverable: false,
        showOnlineStatus: true,
      },
    });
  });
});
