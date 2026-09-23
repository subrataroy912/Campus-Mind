import { describe, expect, it } from "vitest";
import { appRouteConfig } from "./AppRoutes.jsx";
import { getProtectedRouteState } from "@/context/authSession.js";

describe("application route auth restoration", () => {
  it("restores sessions for the public branch before deciding whether to redirect", () => {
    const rootRoute = appRouteConfig[0];
    const publicRoute = rootRoute.children.find(
      (route) => route.element?.type?.name === "PublicRoute"
    );

    expect(publicRoute?.handle).toEqual({ requiresSessionRestore: true });
  });

  it("marks the protected branch with isProtected: true", () => {
    const rootRoute = appRouteConfig[0];
    const protectedRoute = rootRoute.children.find(
      (route) => route.element?.type?.name === "ProtectedRoute"
    );

    expect(protectedRoute?.handle).toEqual({
      requiresSessionRestore: true,
      isProtected: true,
    });
  });

  it("keeps auth-independent branches explicitly exempt from restoration", () => {
    const rootRoute = appRouteConfig[0];
    const serverDownRoute = rootRoute.children.find(
      (route) => route.path === "/server-down"
    );
    const catchAllRoute = rootRoute.children.find(
      (route) => route.path === "*"
    );

    expect(serverDownRoute?.handle).toBeUndefined();
    expect(catchAllRoute?.handle).toBeUndefined();
  });

  it("keeps the public page visible when session restoration fails", () => {
    expect(getProtectedRouteState("failed", false)).toBe("unauthenticated");
  });

  it("protects routes.spaces.new behind CreatorRoute", () => {
    const rootRoute = appRouteConfig[0];
    const protectedRoute = rootRoute.children.find(
      (route) => route.element?.type?.name === "ProtectedRoute"
    );
    const dashboardLayoutRoute = protectedRoute?.children?.[0];
    const creatorRoute = dashboardLayoutRoute?.children?.find(
      (route) => route.element?.type?.name === "CreatorRoute"
    );

    expect(creatorRoute).toBeDefined();
    const createSpaceRoute = creatorRoute?.children?.find(
      (route) => route.path === "/spaces/new"
    );
    expect(createSpaceRoute).toBeDefined();
  });

  it("configures RouteErrorBoundary at root and dashboard layout levels", () => {
    const rootRoute = appRouteConfig[0];
    expect(rootRoute.errorElement).toBeDefined();

    const protectedRoute = rootRoute.children.find(
      (route) => route.element?.type?.name === "ProtectedRoute"
    );
    const dashboardLayoutRoute = protectedRoute?.children?.[0];
    expect(dashboardLayoutRoute?.errorElement).toBeDefined();
  });

  it("provides top-level convenience redirects for direct /login and /register URLs", () => {
    const rootRoute = appRouteConfig[0];
    const loginRedirect = rootRoute.children.find(
      (route) => route.path === "/login"
    );
    const registerRedirect = rootRoute.children.find(
      (route) => route.path === "/register"
    );

    expect(loginRedirect?.element?.props?.to).toBe("/auth/login");
    expect(registerRedirect?.element?.props?.to).toBe("/auth/register");
  });
});

