import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

let mockAuthState = {
  authStatus: "succeeded",
  isAuthenticated: true,
  user: { id: "u1", profileCompleted: true, isOnboarding: false },
};

let mockLocation = { pathname: "/" };

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

vi.mock("react-router", () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useLocation: () => mockLocation,
  useNavigate: () => vi.fn(),
}));

vi.mock("../features/auth/components/SessionBootstrapSkeleton.jsx", () => ({
  default: () => <div data-testid="skeleton">Hydrating Skeleton</div>,
}));

vi.mock("@/features/profile/components/OnboardingDiscardDialog.jsx", () => ({
  OnboardingDiscardDialog: ({ open }) => (
    <div data-testid="discard-dialog" data-open={String(open)}>
      Discard Dialog
    </div>
  ),
}));

describe("ProtectedRoute onboarding enforcement", () => {
  it("redirects unauthenticated users to login", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: false,
      user: null,
    };
    mockLocation = { pathname: "/dashboard" };
    const html = renderToString(<ProtectedRoute />);
    expect(html).toContain('data-to="/auth/login"');
  });

  it("redirects onboarding user on dashboard to /profile/new", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: false, isOnboarding: true },
    };
    mockLocation = { pathname: "/" };
    const html = renderToString(<ProtectedRoute />);
    expect(html).toContain('data-to="/profile/new"');
  });

  it("allows onboarding user to render /profile/new", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: false, isOnboarding: true },
    };
    mockLocation = { pathname: "/profile/new" };
    const html = renderToString(<ProtectedRoute />);
    expect(html).toContain("Outlet Content");
  });

  it("redirects completed user visiting /profile/new back to home", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: true, isOnboarding: false },
    };
    mockLocation = { pathname: "/profile/new" };
    const html = renderToString(<ProtectedRoute />);
    expect(html).toContain('data-to="/"');
  });
});

describe("PublicRoute onboarding handling", () => {
  it("redirects onboarding user on /auth/register directly to /profile/new without modal", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: false, isOnboarding: true },
    };
    mockLocation = { pathname: "/auth/register" };
    const html = renderToString(<PublicRoute />);
    expect(html).toContain('data-to="/profile/new"');
    expect(html).not.toContain("discard-dialog");
  });

  it("shows discard dialog when onboarding user visits /auth/login", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: false, isOnboarding: true },
    };
    mockLocation = { pathname: "/auth/login" };
    const html = renderToString(<PublicRoute />);
    expect(html).toContain("discard-dialog");
  });

  it("redirects completed authenticated user to dashboard", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: true,
      user: { id: "u1", profileCompleted: true, isOnboarding: false },
    };
    mockLocation = { pathname: "/auth/login" };
    const html = renderToString(<PublicRoute />);
    expect(html).toContain('data-to="/"');
  });

  it("allows unauthenticated user to access public routes", () => {
    mockAuthState = {
      authStatus: "succeeded",
      isAuthenticated: false,
      user: null,
    };
    mockLocation = { pathname: "/auth/login" };
    const html = renderToString(<PublicRoute />);
    expect(html).toContain("Outlet Content");
  });
});
