import { safeLocalStorageGet, safeLocalStorageSet } from "@/utils/storage.js";

const THEME_KEY = "campus-mind.theme";
const SETTINGS_KEY = "campus-mind.settings";
const DEFAULT_THEME = "light";
const DEFAULT_SETTINGS = {
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
};

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

function normalizeSettings(value = {}) {
  const notifications = {
    ...DEFAULT_SETTINGS.notifications,
    ...(value.notifications ?? {}),
  };
  const privacy = {
    ...DEFAULT_SETTINGS.privacy,
    ...(value.privacy ?? {}),
  };

  return {
    notifications: {
      classAnnouncements: Boolean(notifications.classAnnouncements),
      directMessages: Boolean(notifications.directMessages),
      assignmentReminders: Boolean(notifications.assignmentReminders),
      weeklyDigest: Boolean(notifications.weeklyDigest),
    },
    privacy: {
      discoverable: Boolean(privacy.discoverable),
      showOnlineStatus: Boolean(privacy.showOnlineStatus),
    },
  };
}

export async function fetchSettings() {
  const rawValue = safeLocalStorageGet(SETTINGS_KEY);
  if (rawValue === null) {
    return delay(DEFAULT_SETTINGS);
  }

  try {
    const parsed = JSON.parse(rawValue);
    return delay(normalizeSettings(parsed));
  } catch {
    return delay(DEFAULT_SETTINGS);
  }
}

export async function updateSettings(nextSettings = {}) {
  const normalized = normalizeSettings(nextSettings);

  if (!safeLocalStorageSet(SETTINGS_KEY, JSON.stringify(normalized))) {
    throw new Error("Unable to save the settings.");
  }

  return delay(normalized);
}

export async function fetchTheme() {
  let theme = DEFAULT_THEME;

  const storedTheme = safeLocalStorageGet(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    theme = storedTheme;
  }

  return delay(theme);
}

export async function updateTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Unsupported theme.");
  }

  if (!safeLocalStorageSet(THEME_KEY, theme)) {
    throw new Error("Unable to save the theme preference.");
  }

  return delay(theme);
}
