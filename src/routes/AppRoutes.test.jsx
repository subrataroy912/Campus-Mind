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
});
