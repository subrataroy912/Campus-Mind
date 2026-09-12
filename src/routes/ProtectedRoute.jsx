import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "../context/authSession.js";

export default function ProtectedRoute() {
  const { isAuthenticated, authStatus } = useAuth();
  const location = useLocation();

  const routeState = getProtectedRouteState(authStatus, isAuthenticated);

  if (routeState === "hydrating") {
    return (
      <main
        className="flex min-h-screen flex-col bg-canvas p-4 sm:p-6"
        role="status"
        aria-live="polite"
        aria-label="Restoring session"
      >
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="h-14 w-full rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border animate-pulse flex items-center justify-between">
            <div className="h-6 w-32 rounded-lg bg-border/50" />
            <div className="h-8 w-8 rounded-full bg-border/50" />
          </div>
          <div className="h-64 w-full rounded-2xl bg-surface p-6 shadow-xs ring-1 ring-border animate-pulse" />
        </div>
      </main>
    );
  }

  return routeState === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
}
