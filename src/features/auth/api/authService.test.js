import { afterEach, describe, expect, it, vi } from "vitest";
import { logout, normalizeAuthResponse, refresh } from "./authService.js";
import { handleOAuthFailure, parseOAuthCallback } from "../oauth.js";
import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";
import { setSession } from "../authSlice.js";
import {
  LEGACY_AUTH_STORAGE_KEYS,
  clearLocalAuthSession,
} from "@/context/authSession.js";

function createStorage({ blocked = false } = {}) {
  const values = new Map();
  return {
    getItem(key) {
      if (blocked) throw new Error("storage blocked");
      return values.get(key) ?? null;
    },
    removeItem(key) {
      if (blocked) throw new Error("storage blocked");
      values.delete(key);
    },
    setItem(key, value) {
      if (blocked) throw new Error("storage blocked");
      values.set(key, String(value));
    },
  };
}

afterEach(() => {
  store.dispatch({ type: "auth/clearCredentials" });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("normalizeAuthResponse", () => {
  it("maps the flat backend credential response into auth state", () => {
    const result = normalizeAuthResponse({
      accessToken: "access-token",
      userId: "user-1",
      email: "student@example.com",
      displayName: "Campus Student",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(result).toEqual({
      accessToken: "access-token",
      user: {
        id: "user-1",
        email: "student@example.com",
        name: "Campus Student",
        avatar: "https://example.com/avatar.png",
        avatarUrl: "https://example.com/avatar.png",
      },
    });
  });

  it("keeps compatibility with nested token and user responses", () => {
    expect(
      normalizeAuthResponse({
        token: "access-token",
        user: { id: "user-1", name: "Campus Student" },
      })
    ).toEqual({
      accessToken: "access-token",
      user: { id: "user-1", name: "Campus Student" },
    });
  });

  it("does not invent a user when an OAuth callback contains only tokens", () => {
    expect(
      normalizeAuthResponse({
        accessToken: "access-token",
      })
    ).toEqual({
      accessToken: "access-token",
      user: null,
    });
  });

  it("handles OAuth callback failures without leaving a rejected promise unhandled", async () => {
    const completeOAuth = async () => {
      throw new Error("oauth_failed");
    };

    await expect(
      handleOAuthFailure({ completeOAuth, errorMessage: "oauth_failed" })
    ).resolves.toBeInstanceOf(Error);
  });

  it("parses a URLSearchParams-decoded OAuth user exactly once", () => {
    const callback = parseOAuthCallback(
      new URLSearchParams({
        access_token: "access-token",
        refresh_token: "refresh-token",
        user: JSON.stringify({ id: "user-1", name: "100% Campus Student" }),
      })
    );

    expect(callback).toEqual({
      accessToken: "access-token",
      user: { id: "user-1", name: "100% Campus Student" },
      userId: null,
      email: null,
      displayName: null,
      avatarUrl: null,
    });
  });

  it("surfaces malformed user profiles as OAuth failures", () => {
    expect(
      parseOAuthCallback(new URLSearchParams({ user: "not-json" }))
    ).toEqual({
      errorMessage:
        "The social sign-in response contained an invalid user profile.",
    });
  });
});

describe("session refresh", () => {
  it("uses the shared API configuration and cookie credentials", async () => {
    const requests = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request) => {
        requests.push(request);
        return new Response(
          JSON.stringify({ data: { accessToken: "refreshed-access" } }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      })
    );

    await expect(refresh()).resolves.toEqual({
      accessToken: "refreshed-access",
      user: null,
    });

    expect(requests).toHaveLength(1);
    expect(new URL(requests[0].url).pathname).toBe("/v1/auth/refresh");
    expect(requests[0].credentials).toBe("include");
  });
});

describe("logout", () => {
  it("clears local state and requests cookie-backed logout without a refresh token body", async () => {
    const initiate = vi.spyOn(authApi.endpoints.logout, "initiate");

    await expect(logout()).resolves.toBeUndefined();

    expect(initiate).toHaveBeenCalledWith();
    expect(store.getState().auth).toEqual({
      accessToken: null,
      user: null,
    });
  });

  it("keeps local teardown when the server logout request rejects", async () => {
    store.dispatch(
      setSession({
        accessToken: "access-token",
        user: { id: "student-1" },
      })
    );
    const initiate = vi
      .spyOn(authApi.endpoints.logout, "initiate")
      .mockReturnValue(() => ({
        unwrap: () => Promise.reject(new Error("offline")),
      }));

    await expect(logout()).resolves.toBeUndefined();

    expect(initiate).toHaveBeenCalledWith();
    expect(store.getState().auth).toEqual({
      accessToken: null,
      user: null,
    });
  });

  it("removes the session, cache, and every supported legacy storage key", () => {
    const localStorage = createStorage();
    vi.stubGlobal("window", { localStorage });
    localStorage.setItem("campus-mind.session", "session");
    localStorage.setItem("campus-mind.api-cache.v1", "cache");
    localStorage.setItem("campus-mind.migrated-legacy-auth-keys", "0");
    LEGACY_AUTH_STORAGE_KEYS.forEach((key) =>
      localStorage.setItem(key, "token")
    );

    clearLocalAuthSession(store.dispatch);

    expect(localStorage.getItem("campus-mind.session")).toBeNull();
    expect(localStorage.getItem("campus-mind.api-cache.v1")).toBeNull();
    LEGACY_AUTH_STORAGE_KEYS.forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
    expect(localStorage.getItem("campus-mind.migrated-legacy-auth-keys")).toBe(
      "1"
    );
  });

  it("does not throw when browser storage is blocked", () => {
    vi.stubGlobal("window", { localStorage: createStorage({ blocked: true }) });

    expect(() => clearLocalAuthSession(store.dispatch)).not.toThrow();
  });
});
