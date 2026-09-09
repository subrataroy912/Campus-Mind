import { safeLocalStorageGet, safeLocalStorageSet } from "@/utils/storage.js";

const STORAGE_KEY = "campus-mind.notifications";
const DEFAULT_NOTIFICATIONS = [
  {
    id: "welcome-1",
    title: "Welcome to CampusMind",
    message: "Your learning space is ready. Explore your classes and get started.",
    read: false,
    createdAt: "2026-09-08T09:00:00Z",
  },
  {
    id: "class-1",
    title: "Class update",
    message: "Your instructor shared a new announcement in your class feed.",
    read: false,
    createdAt: "2026-09-08T09:15:00Z",
  },
  {
    id: "reminder-1",
    title: "Assignment reminder",
    message: "A class assignment is due soon. Review your work before the deadline.",
    read: false,
    createdAt: "2026-09-08T09:30:00Z",
  },
];

function normalizeList(items = []) {
  return items.map((item) => ({
    ...item,
    read: Boolean(item.read),
    id: String(item.id ?? crypto.randomUUID?.() ?? Date.now().toString()),
  }));
}

export async function fetchNotifications() {
  const rawValue = safeLocalStorageGet(STORAGE_KEY);
  if (rawValue === null) {
    return DEFAULT_NOTIFICATIONS;
  }

  try {
    const stored = JSON.parse(rawValue);
    return normalizeList(Array.isArray(stored) ? stored : DEFAULT_NOTIFICATIONS);
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export async function markNotificationRead(notificationId) {
  const notifications = await fetchNotifications();
  const updated = notifications.map((item) =>
    item.id === notificationId ? { ...item, read: true } : item,
  );

  if (!safeLocalStorageSet(STORAGE_KEY, JSON.stringify(updated))) {
    throw new Error("Unable to save notification state.");
  }

  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("campusmind:lifecycle-refresh", {
      detail: { eventName: "notification-marked-read" },
    }));
  }

  return updated.find((item) => item.id === notificationId) ?? { id: notificationId, read: true };
}

export async function markAllNotificationsRead() {
  const updated = (await fetchNotifications()).map((item) => ({ ...item, read: true }));

  if (!safeLocalStorageSet(STORAGE_KEY, JSON.stringify(updated))) {
    throw new Error("Unable to save notification state.");
  }

  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("campusmind:lifecycle-refresh", {
      detail: { eventName: "notifications-updated" },
    }));
  }

  return updated;
}
