import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import AsyncStateBoundary from "./AsyncStateBoundary.jsx";
import ErrorState from "./ErrorState.jsx";
import { InlineLoader } from "./LoadingState.jsx";

describe("AsyncStateBoundary", () => {
  it("renders skeleton preset when isLoading is true and hasData is false", () => {
    const html = renderToString(
      <AsyncStateBoundary isLoading={true} hasData={false} loadingFallback="feed">
        <div>Loaded Feed</div>
      </AsyncStateBoundary>,
    );
    expect(html).toContain('aria-label="Loading stream updates"');
    expect(html).not.toContain("Loaded Feed");
  });

  it("preserves stale-while-revalidate content when hasData is true even if isLoading is true", () => {
    const html = renderToString(
      <AsyncStateBoundary isLoading={true} hasData={true} loadingFallback="feed">
        <div>Cached Feed Content</div>
      </AsyncStateBoundary>,
    );
    expect(html).toContain("Cached Feed Content");
    expect(html).not.toContain('aria-label="Loading stream updates"');
  });

  it("renders ErrorState with parsed message and retry button when error is present and hasData is false", () => {
    const onRetry = vi.fn();
    const html = renderToString(
      <AsyncStateBoundary
        isLoading={false}
        hasData={false}
        error={{ data: { message: "Database timeout" } }}
        errorTitle="Failed to fetch spaces"
        onRetry={onRetry}
      >
        <div>Spaces Content</div>
      </AsyncStateBoundary>,
    );
    expect(html).toContain("Failed to fetch spaces");
    expect(html).toContain("Database timeout");
    expect(html).toContain("Try again");
    expect(html).not.toContain("Spaces Content");
  });

  it("renders EmptyState when isEmpty is true and not loading or erroring", () => {
    const html = renderToString(
      <AsyncStateBoundary
        isLoading={false}
        hasData={false}
        isEmpty={true}
        emptyTitle="No coursework found"
        emptyDescription="Assignments will show up here."
      >
        <div>Coursework List</div>
      </AsyncStateBoundary>,
    );
    expect(html).toContain("No coursework found");
    expect(html).toContain("Assignments will show up here.");
    expect(html).not.toContain("Coursework List");
  });

  it("renders InlineLoader when showInlineFetching and isFetching are true", () => {
    const html = renderToString(
      <AsyncStateBoundary
        isLoading={false}
        isFetching={true}
        hasData={true}
        showInlineFetching={true}
        fetchingLabel="Syncing spaces…"
      >
        <div>Existing Spaces</div>
      </AsyncStateBoundary>,
    );
    expect(html).toContain("Syncing spaces…");
    expect(html).toContain("Existing Spaces");
  });
});

describe("ErrorState & InlineLoader", () => {
  it("renders compact ErrorState with retry button", () => {
    const html = renderToString(
      <ErrorState
        compact
        error="Unable to load comments"
        onRetry={() => {}}
      />,
    );
    expect(html).toContain("Unable to load comments");
    expect(html).toContain("Retry");
  });

  it("renders InlineLoader label", () => {
    const html = renderToString(<InlineLoader label="Updating feed…" />);
    expect(html).toContain("Updating feed…");
  });
});
