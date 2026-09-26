import { describe, expect, it } from "vitest";
import { splitIntoReadableParagraphs } from "./messageFormatters.js";

describe("splitIntoReadableParagraphs", () => {
  it("returns empty array for empty or falsy text", () => {
    expect(splitIntoReadableParagraphs("")).toEqual([]);
    expect(splitIntoReadableParagraphs(null)).toEqual([]);
    expect(splitIntoReadableParagraphs("   ")).toEqual([]);
  });

  it("splits text separated by double newlines into paragraphs", () => {
    const text = "First paragraph.\n\nSecond paragraph.";
    const result = splitIntoReadableParagraphs(text);
    expect(result).toEqual(["First paragraph.", "Second paragraph."]);
  });

  it("preserves single paragraphs that are short", () => {
    const text = "This is a single short sentence.";
    const result = splitIntoReadableParagraphs(text);
    expect(result).toEqual(["This is a single short sentence."]);
  });

  it("normalizes carriage returns and multiple newlines", () => {
    const text = "Paragraph 1\r\n\r\n\r\nParagraph 2";
    const result = splitIntoReadableParagraphs(text);
    expect(result).toEqual(["Paragraph 1", "Paragraph 2"]);
  });
});
