import { Suspense } from "react";
import { Outlet } from "react-router";
import BrandLogo from "@/components/common/BrandLogo.jsx";

function AuthLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] flex-col items-center justify-center gap-3 py-6"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-muted border-t-primary" />
      <span className="text-xs text-muted-foreground">Loading...</span>
    </div>
  );
}

function AuthLayout() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-canvas px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <div className="mt-5 rounded-xl border border-border/80 bg-surface p-5 shadow-xs sm:p-6">
          <Suspense fallback={<AuthLoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
