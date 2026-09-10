import { afterEach, describe, expect, it, vi } from "vitest";
import { logout, normalizeAuthResponse } from "./authService.js";
import { handleOAuthFailure, parseOAuthCallback } from "../oauth.js";
import { store } from "@/app/store.js";
import { authApi } from "./authApi.js";
import { setCredentials } from "../authSlice.js";
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
      refreshToken: "refresh-token",
      userId: "user-1",
      email: "student@example.com",
      displayName: "Campus Student",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
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
      refreshToken: null,
      user: { id: "user-1", name: "Campus Student" },
    });
  });

  it("does not invent a user when an OAuth callback contains only tokens", () => {
    expect(
      normalizeAuthResponse({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      })
    ).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
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
      refreshToken: "refresh-token",
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

describe("logout", () => {
  it("clears local state and requests cookie-backed logout without a refresh token body", async () => {
    const initiate = vi.spyOn(authApi.endpoints.logout, "initiate");

    await expect(logout()).resolves.toBeUndefined();

    expect(initiate).toHaveBeenCalledWith();
    expect(store.getState().auth).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  });

  it("keeps local teardown when the server logout request rejects", async () => {
    store.dispatch(
      setCredentials({
        accessToken: "access-token",
        refreshToken: "refresh-token",
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
      refreshToken: null,
      user: null,
    });
  });

  it("tears down local state without waiting for a stalled logout request", async () => {
    store.dispatch(
      setCredentials({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: { id: "student-1" },
      })
    );
    const initiate = vi
      .spyOn(authApi.endpoints.logout, "initiate")
      .mockReturnValue(() => ({
        unwrap: () => new Promise(() => {}),
      }));

    await expect(logout()).resolves.toBeUndefined();

    expect(initiate).toHaveBeenCalledWith();
    expect(store.getState().auth).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  });

  it("removes the session, cache, and every supported legacy storage key", () => {
    const localStorage = createStorage();
    vi.stubGlobal("window", { localStorage });
    localStorage.setItem("campus-mind.session", "session");
    localStorage.setItem("campus-mind.api-cache.v1", "cache");
    LEGACY_AUTH_STORAGE_KEYS.forEach((key) =>
      localStorage.setItem(key, "token")
    );

    clearLocalAuthSession(store.dispatch);

    expect(localStorage.getItem("campus-mind.session")).toBeNull();
    expect(localStorage.getItem("campus-mind.api-cache.v1")).toBeNull();
    LEGACY_AUTH_STORAGE_KEYS.forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  it("does not throw when browser storage is blocked", () => {
    vi.stubGlobal("window", { localStorage: createStorage({ blocked: true }) });

    expect(() => clearLocalAuthSession(store.dispatch)).not.toThrow();
  });
});
