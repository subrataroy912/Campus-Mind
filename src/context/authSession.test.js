import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  clearLocalAuthSession,
  commitAuthSession,
  getProtectedRouteState,
  hasStoredSessionHint,
  hydratePersistedSession,
  isExpiredSessionError,
  mergeProfileIntoCurrentSession,
  routeRequiresSessionRestore,
  setStoredSessionHint,
  shouldAttemptSessionRestore,
  HAS_SESSION_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
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

function createStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    clear() {
      values.clear();
    },
  };
}

describe("session hint management", () => {
  let localStorage;

  beforeEach(() => {
    localStorage = createStorage();
    vi.stubGlobal("window", { localStorage });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("checks stored session hint from hasSession key or refreshToken", () => {
    expect(hasStoredSessionHint()).toBe(false);

    setStoredSessionHint(true);
    expect(hasStoredSessionHint()).toBe(true);

    setStoredSessionHint(false);
    expect(hasStoredSessionHint()).toBe(false);

    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "test-refresh-token");
    expect(hasStoredSessionHint()).toBe(true);
  });

  it("sets session hint when commitAuthSession succeeds", () => {
    const dispatch = vi.fn();
    commitAuthSession(dispatch, {
      accessToken: "token-123",
      user: { id: "user-1" },
    });

    expect(localStorage.getItem(HAS_SESSION_KEY)).toBe("true");
    expect(dispatch).toHaveBeenCalled();
  });

  it("clears session hint and refresh token when clearLocalAuthSession is called", () => {
    localStorage.setItem(HAS_SESSION_KEY, "true");
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "token-123");

    const dispatch = vi.fn();
    clearLocalAuthSession(dispatch);

    expect(localStorage.getItem(HAS_SESSION_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
  });
});

describe("conditional session restoration", () => {
  const publicRoutes = [
    { pathname: "/", handle: { requiresSessionRestore: true } },
    { pathname: "/auth/login", handle: { requiresSessionRestore: true } },
    { pathname: "/auth/register", handle: { requiresSessionRestore: true } },
  ];

  const protectedRoutes = [
    { pathname: "/dashboard", handle: { requiresSessionRestore: true, isProtected: true } },
    { pathname: "/dashboard/classes/1", handle: { requiresSessionRestore: true } },
  ];

  it("skips restoration when route does not require it", () => {
    expect(shouldAttemptSessionRestore([{ pathname: "/server-down" }], true)).toBe(false);
    expect(shouldAttemptSessionRestore([{ pathname: "/404" }], false)).toBe(false);
  });

  it("skips restoration on public routes when no session hint exists", () => {
    publicRoutes.forEach((route) => {
      expect(shouldAttemptSessionRestore([route], false)).toBe(false);
    });
  });

  it("attempts restoration on public routes when a session hint exists", () => {
    publicRoutes.forEach((route) => {
      expect(shouldAttemptSessionRestore([route], true)).toBe(true);
    });
  });

  it("always attempts restoration on protected routes even without a session hint", () => {
    protectedRoutes.forEach((route) => {
      expect(shouldAttemptSessionRestore([route], false)).toBe(true);
      expect(shouldAttemptSessionRestore([route], true)).toBe(true);
    });
  });
});
