import { describe, expect, it } from "vitest";
import {
  CLASSROOM_THEMES,
  getClassTheme,
} from "./classTheme.js";

describe("classTheme utility", () => {
  it("provides 8 curated themes with valid swatches and gradients", () => {
    expect(CLASSROOM_THEMES.length).toBe(8);
    for (const theme of CLASSROOM_THEMES) {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.swatchClass).toContain("bg-");
      expect(theme.gradientClass).toContain("bg-gradient-to-r");
      expect(theme.colorHex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("resolves explicit theme matching an ID", () => {
    const theme = getClassTheme({ theme: "emerald" });
    expect(theme.id).toBe("emerald");
    expect(theme.gradientClass).toContain("emerald");
  });

  it("handles legacy theme values gracefully", () => {
    const theme = getClassTheme({ theme: "bg-slate-900 text-white" });
    expect(theme.id).toBe("slate");
  });

  it("resolves deterministic theme by subject when theme is missing", () => {
    const mathTheme = getClassTheme({ subject: "Mathematics" });
    expect(mathTheme.id).toBe("indigo");

    const scienceTheme = getClassTheme({ subject: "Science" });
    expect(scienceTheme.id).toBe("emerald");

    const csTheme = getClassTheme({ subject: "Computer Science" });
    expect(csTheme.id).toBe("cyan");

    const historyTheme = getClassTheme({ subject: "History" });
    expect(historyTheme.id).toBe("amber");

    const artTheme = getClassTheme({ subject: "Art" });
    expect(artTheme.id).toBe("rose");
  });

  it("deterministically resolves by title or ID when subject is unspecified or other", () => {
    const theme1 = getClassTheme({ title: "Robotics Workshop", id: "course-123" });
    const theme2 = getClassTheme({ title: "Robotics Workshop", id: "course-123" });
    expect(theme1.id).toBe(theme2.id);
  });
});
