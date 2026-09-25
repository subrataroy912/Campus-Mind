import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import CreatorRoute from "./CreatorRoute.jsx";

let mockAuthState = {
  authStatus: "authenticated",
  isAuthenticated: true,
  user: { id: "u1", canCreateCourses: true },
};

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

vi.mock("react-router", () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

vi.mock("../features/auth/components/SessionBootstrapSkeleton.jsx", () => ({
  default: () => <div data-testid="skeleton">Hydrating Skeleton</div>,
}));

describe("CreatorRoute access control", () => {
  it("renders skeleton when session is hydrating", () => {
    mockAuthState = {
      authStatus: "hydrating",
      isAuthenticated: false,
      user: null,
    };
    const html = renderToString(<CreatorRoute />);
    expect(html).toContain("Hydrating Skeleton");
  });

  it("redirects unauthenticated users to /auth/login", () => {
    mockAuthState = {
      authStatus: "idle",
      isAuthenticated: false,
      user: null,
    };
    const html = renderToString(<CreatorRoute />);
    expect(html).toContain('data-to="/auth/login"');
  });

  it("redirects non-creator authenticated users to home/dashboard", () => {
    mockAuthState = {
      authStatus: "authenticated",
      isAuthenticated: true,
      user: { id: "u1", canCreateCourses: false },
    };
    const html = renderToString(<CreatorRoute />);
    expect(html).toContain('data-to="/"');
    expect(html).not.toContain("Outlet Content");
  });

  it("renders outlet for creator users", () => {
    mockAuthState = {
      authStatus: "authenticated",
      isAuthenticated: true,
      user: { id: "u1", canCreateCourses: true },
    };
    const html = renderToString(<CreatorRoute />);
    expect(html).toContain("Outlet Content");
    expect(html).not.toContain('data-to="/dashboard"');
  });

  it("renders outlet for admin users even without canCreateCourses", () => {
    mockAuthState = {
      authStatus: "authenticated",
      isAuthenticated: true,
      user: { id: "u1", canCreateCourses: false, isAdmin: true },
    };
    const html = renderToString(<CreatorRoute />);
    expect(html).toContain("Outlet Content");
    expect(html).not.toContain('data-to="/dashboard"');
  });

  it("renders children when provided for creator users", () => {
    mockAuthState = {
      authStatus: "authenticated",
      isAuthenticated: true,
      user: { id: "u1", canCreateCourses: true },
    };
    const html = renderToString(
      <CreatorRoute>
        <span>Protected Create Class Content</span>
      </CreatorRoute>
    );
    expect(html).toContain("Protected Create Class Content");
  });
});
