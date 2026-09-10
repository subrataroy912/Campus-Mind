import { describe, expect, it, vi } from "vitest";
import {
  getProtectedRouteState,
  hydratePersistedSession,
  mergeProfileIntoCurrentSession,
} from "./authSession.js";

const persistedSession = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
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
    expect(result).toMatchObject({ status: "succeeded", user: persistedSession });
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
      refreshToken: "refresh-token",
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
});
