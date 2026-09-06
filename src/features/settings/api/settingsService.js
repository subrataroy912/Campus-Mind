const THEME_KEY = "campus-mind.theme";
const DEFAULT_THEME = "light";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

export async function fetchTheme() {
  let theme = DEFAULT_THEME;

  try {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") theme = storedTheme;
  } catch {
    theme = DEFAULT_THEME;
  }

  return delay(theme);
}

export async function updateTheme(theme) {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Unsupported theme.");
  }

  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    throw new Error("Unable to save the theme preference.");
  }

  return delay(theme);
}
