import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import SearchInput from "./SearchInput.jsx";

describe("SearchInput", () => {
  it("renders with placeholder and aria-label", () => {
    const html = renderToString(
      <SearchInput placeholder="Search spaces…" />
    );

    expect(html).toContain('placeholder="Search spaces…"');
    expect(html).toContain('aria-label="Search spaces…"');
  });

  it("renders controlled value and clear button when value is non-empty", () => {
    const html = renderToString(
      <SearchInput value="test query" placeholder="Search..." />
    );

    expect(html).toContain('value="test query"');
    expect(html).toContain('aria-label="Clear search"');
  });

  it("does not render clear button when value is empty", () => {
    const html = renderToString(
      <SearchInput value="" placeholder="Search..." />
    );

    expect(html).toContain('value=""');
    expect(html).not.toContain('aria-label="Clear search"');
  });

  it("applies custom container className and preserves layout classes", () => {
    const html = renderToString(
      <SearchInput className="flex-1 sm:w-60 min-w-0" />
    );

    expect(html).toContain("flex-1 sm:w-60 min-w-0");
  });

  it("forwards inputClassName and extra props to Input element", () => {
    const html = renderToString(
      <SearchInput
        inputClassName="custom-input-class"
        autoFocus
        name="space-search"
        data-testid="search-bar"
      />
    );

    expect(html).toContain("custom-input-class");
    expect(html).toContain("autofocus");
    expect(html).toContain('name="space-search"');
    expect(html).toContain('data-testid="search-bar"');
  });
});
