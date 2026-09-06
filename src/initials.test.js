import { describe, it, expect } from "vitest";
import { initials } from "./utils/initials.js";
import { formatClassCode, normalizeClassCode } from "./utils/classCode.js";

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

  it("should normalize and format eight-character class codes", () => {
    expect(normalizeClassCode("alg2-7x9k-extra")).toBe("ALG27X9K");
    expect(formatClassCode(["A", "L", "G", "2", "7", "X", "9", "K"])).toBe("ALG2-7X9K");
  });
});