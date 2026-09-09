import { beforeEach, describe, expect, it } from "vitest";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notificationsService.js";

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

describe("notificationsService", () => {
  it("loads the default notification list", async () => {
    await expect(fetchNotifications()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          read: false,
          title: expect.any(String),
        }),
      ]),
    );
  });

  it("marks a single notification as read", async () => {
    const notifications = await fetchNotifications();
    const first = notifications[0];

    await expect(markNotificationRead(first.id)).resolves.toMatchObject({
      id: first.id,
      read: true,
    });
  });

  it("marks all notifications as read", async () => {
    await markAllNotificationsRead();

    await expect(fetchNotifications()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ read: true }),
      ]),
    );
  });
});
