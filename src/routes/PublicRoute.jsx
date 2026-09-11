import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span>Loading...</span>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
