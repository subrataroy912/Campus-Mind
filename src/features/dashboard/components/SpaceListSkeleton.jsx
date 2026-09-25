export function SpaceListSkeleton({ viewMode = "list", count = 6 }) {
  if (viewMode === "grid") {
    return (
      <div
        data-testid="space-list-skeleton-grid"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex h-44 w-full flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-4 animate-pulse"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-muted/80" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-3/4 rounded bg-muted/80" />
                  <div className="h-2.5 w-1/2 rounded bg-muted/60" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="h-2.5 w-16 rounded bg-muted/60" />
              <div className="h-2.5 w-12 rounded bg-muted/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid="space-list-skeleton-list"
      className="flex flex-col gap-2"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-14 w-full items-center justify-between rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 animate-pulse"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-7 w-7 rounded-md bg-muted/80 shrink-0" />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="h-3.5 w-1/3 rounded bg-muted/80" />
              <div className="h-2.5 w-1/4 rounded bg-muted/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-14 rounded-full bg-muted/60" />
            <div className="h-5 w-10 rounded bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpaceListSkeleton;
