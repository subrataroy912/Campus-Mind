import { store } from "@/app/store.js";
import { notificationsApi } from "@/features/notifications/api/notificationsApi.js";

const THEME_KEY = "campus-mind.theme";
const DEFAULT_THEME = "light";

export async function fetchSettings() {
  const settings = await store
    .dispatch(notificationsApi.endpoints.getNotificationSettings.initiate())
    .unwrap();
  return { notifications: settings };
}

export async function updateSettings(nextSettings = {}) {
  const notifications = await store
    .dispatch(
      notificationsApi.endpoints.updateNotificationSettings.initiate(
        nextSettings.notifications ?? nextSettings
      )
    )
    .unwrap();
  return { notifications };
}

export async function fetchTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", saved === "dark");
      }
      return saved;
    }
  } catch {
    // ignore storage access errors
  }
  return DEFAULT_THEME;
}

export async function updateTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Unsupported theme.");
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  } catch {
    // ignore storage access errors
  }

  return theme;
}
