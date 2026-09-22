import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import WelcomeModal from "./WelcomeModal.jsx";

// Mock Dialog to render inline in node environment
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <p>{children}</p>,
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

const memorySessionStorage = new MemoryStorage();
const memoryLocalStorage = new MemoryStorage();

globalThis.window = globalThis;
globalThis.sessionStorage = memorySessionStorage;
globalThis.localStorage = memoryLocalStorage;

describe("WelcomeModal", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("does not render modal on standard daily logins", () => {
    // Simulate user active 2 hours ago
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    localStorage.setItem("last_active_at_user123", String(twoHoursAgo));

    const html = renderToString(
      <WelcomeModal
        greetingName="Alex"
        userId="user123"
        isLongTimeAway={false}
      />
    );

    expect(html).not.toContain("Welcome back, Alex!");
    expect(html).not.toContain("Welcome to CampusMind");
  });

  it("renders welcome modal after fresh profile creation", () => {
    sessionStorage.setItem("show_welcome_after_profile_create", "true");

    const html = renderToString(
      <WelcomeModal
        greetingName="Alex"
        userId="user123"
        isLongTimeAway={false}
      />
    );

    expect(html).toContain("Welcome to CampusMind");
    expect(html).toContain("Welcome, Alex!");
    expect(html).toContain("Your profile has been created successfully");
    expect(html).toContain("Start Exploring");
  });

  it("renders welcome back modal when user logs in after long time away (>= 3-4 days)", () => {
    // 4 days ago
    const fourDaysAgo = Date.now() - 4 * 24 * 60 * 60 * 1000;
    localStorage.setItem("last_active_at_user123", String(fourDaysAgo));

    const html = renderToString(
      <WelcomeModal
        greetingName="Alex"
        userId="user123"
        isLongTimeAway={false}
      />
    );

    expect(html).toContain("Your learning space");
    expect(html).toContain("Welcome back, Alex!");
    expect(html).toContain("Pick up right where you left off");
    expect(html).toContain("Get Started");
  });

  it("renders welcome back modal when isLongTimeAway prop is true", () => {
    const html = renderToString(
      <WelcomeModal
        greetingName="Alex"
        userId="user123"
        isLongTimeAway={true}
      />
    );

    expect(html).toContain("Welcome back, Alex!");
    expect(html).toContain("Get Started");
  });
});
