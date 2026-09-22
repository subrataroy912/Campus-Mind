import { store } from "@/app/store.js";
import { notificationsApi } from "@/features/notifications/api/notificationsApi.js";

import { THEMES, THEME_STORAGE_KEY } from "@/context/ThemeContext.jsx";

const DEFAULT_THEME = THEMES.SYSTEM;

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
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === THEMES.LIGHT || saved === THEMES.DARK || saved === THEMES.SYSTEM) {
      return saved;
    }
  } catch {
    // ignore storage access errors
  }
  return DEFAULT_THEME;
}

export async function updateTheme(theme) {
  if (theme !== THEMES.LIGHT && theme !== THEMES.DARK && theme !== THEMES.SYSTEM) {
    throw new Error("Unsupported theme.");
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (typeof document !== "undefined") {
      const isDark =
        theme === THEMES.DARK ||
        (theme === THEMES.SYSTEM &&
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", Boolean(isDark));
    }
  } catch {
    // ignore storage access errors
  }

  return theme;
}

