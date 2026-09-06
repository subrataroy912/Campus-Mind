import { describe, it, expect } from "vitest";

function initials(name) {
  if (!name || typeof name !== "string") return "";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  // Handle single-word names by grabbing the first two letters
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  // Handle multi-word names by grabbing the first letter of the first two words
  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

describe("initials() utility test suite", () => {
  it("should extract two uppercase initials from a full name", () => {
    expect(initials("John Doe")).toBe("JD");
  });

  it("should handle a single word name by grabbing its first two letters", () => {
    expect(initials("subrata")).toBe("SU");
  });

  it("should extract initials correctly for another full name", () => {
    expect(initials("Campus Mind")).toBe("CM"); 
  });
});