import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import SessionBootstrapSkeleton from "./SessionBootstrapSkeleton.jsx";

describe("SessionBootstrapSkeleton", () => {
  it("renders with the preloaded BrandLogo image for instantaneous LCP", () => {
    const html = renderToString(
      <MemoryRouter>
        <SessionBootstrapSkeleton />
      </MemoryRouter>
    );

    expect(html).toContain('src="/logo-square.png"');
    expect(html).toContain('fetchPriority="high"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Restoring session"');
  });
});
