import { describe, it, expect } from "vitest";
import { calculateStreak } from "./streakUtils.js";

describe("streakUtils", () => {
  it("initializes streak to 1 when no stored data exists", () => {
    const streak = calculateStreak(null, "2026-09-17", "2026-09-16");
    expect(streak.count).toBe(1);
    expect(streak.bestStreak).toBe(1);
    expect(streak.activeToday).toBe(true);
    expect(streak.lastActiveDate).toBe("2026-09-17");
  });

  it("maintains current streak count if already active today", () => {
    const existing = {
      count: 5,
      bestStreak: 7,
      lastActiveDate: "2026-09-17",
      activeToday: true,
    };
    const result = calculateStreak(existing, "2026-09-17", "2026-09-16");
    expect(result.count).toBe(5);
    expect(result.bestStreak).toBe(7);
  });

  it("increments streak by 1 if active yesterday", () => {
    const existing = {
      count: 5,
      bestStreak: 5,
      lastActiveDate: "2026-09-16",
    };
    const result = calculateStreak(existing, "2026-09-17", "2026-09-16");
    expect(result.count).toBe(6);
    expect(result.bestStreak).toBe(6);
    expect(result.lastActiveDate).toBe("2026-09-17");
  });

  it("resets streak to 1 if more than 1 day has passed, preserving bestStreak", () => {
    const existing = {
      count: 14,
      bestStreak: 14,
      lastActiveDate: "2026-09-14",
    };
    const result = calculateStreak(existing, "2026-09-17", "2026-09-16");
    expect(result.count).toBe(1);
    expect(result.bestStreak).toBe(14);
    expect(result.lastActiveDate).toBe("2026-09-17");
  });
});
