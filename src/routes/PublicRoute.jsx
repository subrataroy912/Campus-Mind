import React, { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getProtectedRouteState } from "@/context/authSession";
import { routes } from "@/routes/paths.js";
import { OnboardingDiscardDialog } from "@/features/profile/components/OnboardingDiscardDialog.jsx";

export default function PublicRoute() {
  const { isAuthenticated, authStatus, user, cancelOnboarding, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDiscarding, setIsDiscarding] = useState(false);
  const routeState = getProtectedRouteState(authStatus, isAuthenticated);

  if (routeState === "hydrating") {
    return (
      <main
        className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background"
        role="status"
        aria-live="polite"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <span className="sr-only">Loading your session…</span>
      </main>
    );
  }

  const isOnboardingUser =
    routeState === "authenticated" &&
    (user?.profileCompleted === false || user?.isOnboarding === true);

  if (isOnboardingUser) {
    if (
      location.pathname === routes.auth.register ||
      location.pathname === "/register" ||
      location.pathname === routes.auth.callback
    ) {
      return <Navigate to={routes.profile.new} replace />;
    }
    const handleConfirmDiscard = async () => {
      setIsDiscarding(true);
      try {
        if (cancelOnboarding) {
          await cancelOnboarding();
        } else if (logout) {
          await logout();
        }
      } finally {
        setIsDiscarding(false);
      }
    };

    const handleResumeSetup = () => {
      navigate(routes.profile.new, { replace: true });
    };

    return (
      <>
        <OnboardingDiscardDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) handleResumeSetup();
          }}
          onConfirm={handleConfirmDiscard}
          onCancel={handleResumeSetup}
          isDiscarding={isDiscarding}
          title="Incomplete registration in progress"
          description="You have an active registration in progress. Would you like to resume setting up your profile, or discard it to access this page?"
          confirmLabel="Discard & Proceed"
          cancelLabel="Resume Setup"
        />
        <Outlet />
      </>
    );
  }

  if (routeState === "authenticated") {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <Outlet />;
}
