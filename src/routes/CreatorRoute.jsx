import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "../context/authSession.js";
import SessionBootstrapSkeleton from "../features/auth/components/SessionBootstrapSkeleton.jsx";

export default function CreatorRoute({ children, redirectTo = "/dashboard" }) {
  const { user, isAuthenticated, authStatus } = useAuth();

  const routeState = getProtectedRouteState(authStatus, isAuthenticated);

  if (routeState === "hydrating") {
    return <SessionBootstrapSkeleton />;
  }

  if (routeState !== "authenticated") {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user?.canCreateCourses) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
}
