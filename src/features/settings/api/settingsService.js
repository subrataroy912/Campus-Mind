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
  return DEFAULT_THEME;
}

export async function updateTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Unsupported theme.");
  }

  return theme;
}
