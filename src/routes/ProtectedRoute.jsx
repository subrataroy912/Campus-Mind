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
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background"
        role="status"
        aria-live="polite"
      >
        {/* Animated Loading Circle */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

        {/* Screen Reader Only text for accessibility */}
        <span className="sr-only">Loading your session…</span>
      </main>
    );
  }

  return routeState === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
}
