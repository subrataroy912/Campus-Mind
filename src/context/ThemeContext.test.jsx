import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider, useTheme, THEMES, THEME_STORAGE_KEY } from "./ThemeContext.jsx";
import { fetchTheme, updateTheme } from "@/features/settings/api/settingsService.js";

class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const memoryLocalStorage = new MemoryStorage();
globalThis.localStorage = memoryLocalStorage;

describe("ThemeContext and THEMES constants", () => {
  beforeEach(() => {
    memoryLocalStorage.clear();
  });

  afterEach(() => {
    memoryLocalStorage.clear();
  });

  it("exports correct THEMES constants and THEME_STORAGE_KEY", () => {
    expect(THEMES.LIGHT).toBe("light");
    expect(THEMES.DARK).toBe("dark");
    expect(THEMES.SYSTEM).toBe("system");
    expect(THEME_STORAGE_KEY).toBe("campus-mind.theme");
  });

  it("renders ThemeProvider and provides theme context to children", () => {
    function Consumer() {
      const { theme, resolvedTheme } = useTheme();
      return (
        <div>
          <span data-slot="theme">{theme}</span>
          <span data-slot="resolved">{resolvedTheme}</span>
        </div>
      );
    }

    const html = renderToString(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(html).toContain('data-slot="theme"');
    expect(html).toContain(THEMES.SYSTEM);
  });

  it("throws an error when useTheme is called outside ThemeProvider", () => {
    function InvalidConsumer() {
      useTheme();
      return null;
    }

    expect(() => renderToString(<InvalidConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });

  it("persists theme updates in settingsService", async () => {
    expect(await fetchTheme()).toBe(THEMES.SYSTEM);

    await updateTheme(THEMES.DARK);
    expect(memoryLocalStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.DARK);
    expect(await fetchTheme()).toBe(THEMES.DARK);

    await updateTheme(THEMES.LIGHT);
    expect(memoryLocalStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.LIGHT);
    expect(await fetchTheme()).toBe(THEMES.LIGHT);

    await updateTheme(THEMES.SYSTEM);
    expect(memoryLocalStorage.getItem(THEME_STORAGE_KEY)).toBe(THEMES.SYSTEM);
    expect(await fetchTheme()).toBe(THEMES.SYSTEM);
  });

  it("rejects invalid themes in settingsService updateTheme", async () => {
    await expect(updateTheme("neon")).rejects.toThrow("Unsupported theme.");
  });
});
