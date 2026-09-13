import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "../context/authSession.js";

import SessionBootstrapSkeleton from "../features/auth/components/SessionBootstrapSkeleton.jsx";
import { routes } from "./paths.js";

export default function ProtectedRoute() {
  const { isAuthenticated, authStatus } = useAuth();
  const location = useLocation();

  const routeState = getProtectedRouteState(authStatus, isAuthenticated);

  if (routeState === "hydrating") {
    return <SessionBootstrapSkeleton />;
  }

  return routeState === "authenticated" ? (
    <Outlet />
  ) : (
    <Navigate to={routes.auth.login} replace state={{ from: location }} />
  );
}
