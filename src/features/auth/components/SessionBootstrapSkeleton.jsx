export default function SessionBootstrapSkeleton() {
  return (
    <main
      className="flex min-h-screen flex-col bg-canvas p-4 sm:p-6"
      role="status"
      aria-live="polite"
      aria-label="Restoring session"
    >
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex h-14 w-full animate-pulse items-center justify-between rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border">
          <div className="h-6 w-32 rounded-lg bg-border/50" />
          <div className="h-8 w-8 rounded-full bg-border/50" />
        </div>
        <div className="h-64 w-full animate-pulse rounded-2xl bg-surface p-6 shadow-xs ring-1 ring-border" />
      </div>
    </main>
  );
}
