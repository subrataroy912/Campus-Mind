import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import BrandLogo from "./BrandLogo.jsx";

describe("BrandLogo", () => {
  it("renders with default fetchPriority='auto' and logo-square.png", () => {
    const html = renderToString(
      <MemoryRouter>
        <BrandLogo />
      </MemoryRouter>
    );

    expect(html).toContain('src="/logo-square.png"');
    expect(html).toContain('fetchPriority="auto"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('width="40"');
    expect(html).toContain('height="40"');
    expect(html).toContain(">Campus<");
    expect(html).toContain(">Mind<");
  });

  it("supports fetchPriority='high' for above-the-fold headers", () => {
    const html = renderToString(
      <MemoryRouter>
        <BrandLogo fetchPriority="high" />
      </MemoryRouter>
    );

    expect(html).toContain('fetchPriority="high"');
  });

  it("supports compact mode hiding text label", () => {
    const html = renderToString(
      <MemoryRouter>
        <BrandLogo compact fetchPriority="high" />
      </MemoryRouter>
    );

    expect(html).toContain('src="/logo-square.png"');
    expect(html).not.toContain(">Campus<");
    expect(html).not.toContain(">Mind<");
  });
});
