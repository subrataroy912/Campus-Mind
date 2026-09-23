import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";

describe("RouteErrorBoundary", () => {
  it("renders generic application errors with user-friendly recovery options", () => {
    const error = new Error("Database connection dropped");
    const html = renderToString(
      <MemoryRouter>
        <RouteErrorBoundary error={error} />
      </MemoryRouter>
    );

    expect(html).toContain("Application error");
    expect(html).toContain("Database connection dropped");
    expect(html).toContain("Reload Page");
    expect(html).toContain("Home");
  });

  it("identifies dynamic chunk loading failures as application update available", () => {
    const error = new Error("Failed to fetch dynamically imported module: /assets/SpacePage.js");
    const html = renderToString(
      <MemoryRouter>
        <RouteErrorBoundary error={error} />
      </MemoryRouter>
    );

    expect(html).toContain("Update available");
    expect(html).toContain("A new version of Campus Mind is available");
  });

  it("renders route error responses with status badge and specific guidance", () => {
    const errorResponse = {
      status: 404,
      statusText: "Not Found",
      data: "Requested resource missing",
    };
    const html = renderToString(
      <MemoryRouter>
        <RouteErrorBoundary error={errorResponse} />
      </MemoryRouter>
    );

    expect(html).toContain("Error 404");
    expect(html).toContain("Page not found");
    expect(html).toContain("The page you are looking for doesn&#x27;t exist");
  });

  it("renders inline mode for nested dashboard layouts", () => {
    const error = new Error("Inline widget failed");
    const html = renderToString(
      <MemoryRouter>
        <RouteErrorBoundary error={error} isInline />
      </MemoryRouter>
    );

    expect(html).toContain("Return to Dashboard");
    expect(html).toContain("role=\"alert\"");
  });
});
