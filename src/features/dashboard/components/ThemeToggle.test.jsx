import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ThemeToggle from "./ThemeToggle.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";

// Mock dropdown menu components to render properly in node environment
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }) => <div data-slot="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ render, children }) => render || children || null,
  DropdownMenuContent: ({ children }) => <div data-slot="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }) => (
    <button data-slot="dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
}));

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

describe("ThemeToggle", () => {
  beforeEach(() => {
    memoryLocalStorage.clear();
  });

  it("renders the theme toggle button and options inside ThemeProvider", () => {
    const html = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(html).toContain('title="Toggle theme"');
    expect(html).toContain("Light");
    expect(html).toContain("Dark");
    expect(html).toContain("System");
  });
});
