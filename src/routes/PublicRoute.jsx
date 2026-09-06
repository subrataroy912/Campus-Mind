import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  // If they are logged in, send them straight to the dashboard
  // Otherwise, let them see the public page (Outlet)
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
}