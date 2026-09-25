import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "../context/authSession.js";

import SessionBootstrapSkeleton from "../features/auth/components/SessionBootstrapSkeleton.jsx";
import { routes } from "./paths.js";

export default function ProtectedRoute({ unauthenticatedHomeElement = null }) {
  const { isAuthenticated, authStatus, user } = useAuth();
  const location = useLocation();

  const routeState = getProtectedRouteState(authStatus, isAuthenticated);

  if (routeState === "hydrating") {
    return <SessionBootstrapSkeleton />;
  }

  if (routeState !== "authenticated") {
    if (location.pathname === routes.home && unauthenticatedHomeElement) {
      return unauthenticatedHomeElement;
    }
    return (
      <Navigate to={routes.auth.login} replace state={{ from: location }} />
    );
  }

  if (user?.profileCompleted === false && location.pathname !== routes.profile.new) {
    return <Navigate to={routes.profile.new} replace />;
  }

  if (user?.profileCompleted === true && location.pathname === routes.profile.new) {
    return <Navigate to={routes.home} replace />;
  }

  return <Outlet />;
}
