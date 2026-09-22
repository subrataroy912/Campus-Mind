import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
});

export const THEME_STORAGE_KEY = "campus-mind.theme";
const DEFAULT_THEME = THEMES.SYSTEM;

const ThemeContext = createContext(undefined);

const getSystemPreference = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === THEMES.LIGHT || saved === THEMES.DARK || saved === THEMES.SYSTEM) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return DEFAULT_THEME;
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemPreference);

  // Listen to OS preference changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else if (mediaQuery.addListener) {
      // Safari / older browser fallback
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  const resolvedTheme = useMemo(() => {
    if (theme === THEMES.SYSTEM) {
      return systemTheme;
    }
    return theme === THEMES.DARK ? "dark" : "light";
  }, [theme, systemTheme]);

  // Sync the root HTML class with resolvedTheme
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark = resolvedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  }, [resolvedTheme]);

  const setTheme = (nextTheme) => {
    if (
      nextTheme !== THEMES.LIGHT &&
      nextTheme !== THEMES.DARK &&
      nextTheme !== THEMES.SYSTEM
    ) {
      return;
    }
    setThemeState(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage access errors
    }
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      isDark: resolvedTheme === "dark",
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
