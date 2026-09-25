import BrandLogo from "@/components/common/BrandLogo.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import RouteSuspenseFallback from "@/app/layouts/RouteSuspenseFallback.jsx";

export default function SessionBootstrapSkeleton() {
  return (
    <div
      className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground"
      role="status"
      aria-live="polite"
      aria-label="Restoring session"
    >
      {/* Top Header matching Header.jsx (h-14) */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <BrandLogo fetchPriority="high" />
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Main App Workspace matching DashboardLayout.jsx */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        {/* Desktop Sidebar placeholder */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col justify-between border-r border-border bg-card p-3">
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full rounded-lg" />
            ))}
          </div>
          <div className="space-y-1.5 pt-3 border-t border-border/60">
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </aside>

        {/* Active Route Skeleton */}
        <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <RouteSuspenseFallback />
        </main>
      </div>
    </div>
  );
}

