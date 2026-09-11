import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "@/context/authSession";

export default function PublicRoute() {
  const { isAuthenticated, authStatus } = useAuth();
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

  if (routeState === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
