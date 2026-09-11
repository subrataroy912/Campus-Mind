import { describe, expect, it, vi } from "vitest";
import {
  getProtectedRouteState,
  hydratePersistedSession,
  isExpiredSessionError,
  mergeProfileIntoCurrentSession,
  routeRequiresSessionRestore,
} from "./authSession.js";

const persistedSession = {
  accessToken: "access-token",
  id: "user-1",
};

describe("persisted session bootstrap", () => {
  it("installs a valid persisted session before validating its profile", async () => {
    const installCredentials = vi.fn();
    const getProfile = vi.fn().mockResolvedValue({ displayName: "Ada" });

    const result = await hydratePersistedSession({
      session: persistedSession,
      installCredentials,
      getProfile,
    });

    expect(installCredentials).toHaveBeenCalledWith(persistedSession);
    expect(getProfile).toHaveBeenCalledAfter(installCredentials);
    expect(result).toMatchObject({
      status: "succeeded",
      user: persistedSession,
    });
  });

  it("marks an expired persisted session as failed", async () => {
    const result = await hydratePersistedSession({
      session: persistedSession,
      installCredentials: vi.fn(),
      getProfile: vi.fn().mockRejectedValue({ status: 401 }),
    });

    expect(result).toMatchObject({ status: "failed", expired: true });
  });

  it("completes unauthenticated bootstrap when no session is stored", async () => {
    const installCredentials = vi.fn();
    const getProfile = vi.fn();
    const result = await hydratePersistedSession({
      session: null,
      installCredentials,
      getProfile,
    });

    expect(result).toEqual({ status: "succeeded", user: null });
    expect(installCredentials).not.toHaveBeenCalled();
    expect(getProfile).not.toHaveBeenCalled();
  });

  it("keeps the current session when a profile payload is missing or invalid", () => {
    const current = {
      accessToken: "access-token",
      user: { id: "user-1", name: "Ada" },
    };

    expect(
      mergeProfileIntoCurrentSession(() => ({ auth: current }), null)
    ).toEqual(current);
    expect(
      mergeProfileIntoCurrentSession(() => ({ auth: current }), "bad-profile")
    ).toEqual(current);
  });

  it("keeps a cold-start dashboard route in bootstrap until auth resolves", () => {
    expect(getProtectedRouteState("hydrating", false)).toBe("hydrating");
    expect(getProtectedRouteState("succeeded", true)).toBe("authenticated");
    expect(getProtectedRouteState("failed", false)).toBe("unauthenticated");
  });

  it("treats profile 404s as expired only at the authenticated profile endpoint", () => {
    expect(isExpiredSessionError({ status: 404 }, "/users/me")).toBe(true);
    expect(isExpiredSessionError({ status: 404 }, "getCurrentProfile")).toBe(
      true
    );
    expect(isExpiredSessionError({ status: 404 }, "/classes/123")).toBe(false);
    expect(isExpiredSessionError({ status: 404 }, "/v2/users/me/profile")).toBe(
      false
    );
    expect(isExpiredSessionError({ status: 401 }, "/classes/123")).toBe(true);
  });

  it("restores sessions only for routes that require authentication", () => {
    expect(
      routeRequiresSessionRestore([
        { handle: undefined },
        { handle: { requiresSessionRestore: false } },
      ])
    ).toBe(false);
    expect(
      routeRequiresSessionRestore([
        { handle: { requiresSessionRestore: true } },
      ])
    ).toBe(true);
  });
});
