import BrandLogo from "@/components/common/BrandLogo.jsx";

export default function SessionBootstrapSkeleton() {
  return (
    <main
      className="flex min-h-screen flex-col bg-canvas p-4 sm:p-6"
      role="status"
      aria-live="polite"
      aria-label="Restoring session"
    >
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex h-14 w-full items-center justify-between rounded-2xl bg-surface px-4 py-2 shadow-xs ring-1 ring-border">
          <BrandLogo fetchPriority="high" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-border/50" />
        </div>
        <div className="h-64 w-full animate-pulse rounded-2xl bg-surface p-6 shadow-xs ring-1 ring-border" />
      </div>
    </main>
  );
}
