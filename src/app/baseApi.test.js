import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseQueryWithRefresh, shouldForceLogout } from "./baseApi.js";
import {
  mergeProfileIntoCurrentSession,
  readPersistedSession,
} from "../context/authSession.js";

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function createApi({ accessToken = "expired-access", refreshToken = "old-refresh" } = {}) {
  const state = { auth: { accessToken, refreshToken, user: { id: "user-1" } } };
  const actions = [];
  return {
    actions,
    getState: () => state,
    endpoint: "protectedResource",
    dispatch: (action) => {
      actions.push(action);
      if (action.type === "auth/setCredentials" || action.type === "auth/setSession") {
        Object.assign(state.auth, action.payload);
      }
      if (action.type === "auth/clearCredentials") {
        state.auth = { accessToken: null, refreshToken: null, user: null };
      }
      return action;
    },
  };
}

let storage;

beforeEach(() => {
  storage = new Map();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
      clear: () => storage.clear(),
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("shouldForceLogout", () => {
  it("forces logout when the authenticated profile is missing", () => {
    expect(shouldForceLogout("/users/me", 404)).toBe(true);
  });

  it("forces logout when the access token is invalid", () => {
    expect(shouldForceLogout("/classes", 401)).toBe(true);
  });

  it("does not log out on unrelated resource 404s", () => {
    expect(shouldForceLogout("/classes/123", 404)).toBe(false);
  });

  it("does not log out on a successful request", () => {
    expect(shouldForceLogout("/users/me", 200)).toBe(false);
  });

  it("initializes auth state safely when browser storage is unavailable", async () => {
    vi.stubGlobal("window", undefined);
    vi.resetModules();

    const { default: authReducer } = await import(
      "../features/auth/authSlice.js"
    );

    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses one refresh request for simultaneous 401s and retries both with rotated credentials", async () => {
    const api = createApi();
    let refreshCalls = 0;
    const protectedTokens = [];
    vi.stubGlobal("fetch", vi.fn(async (request) => {
      const url = new URL(request.url);
      if (url.pathname.endsWith("/auth/refresh")) {
        refreshCalls += 1;
        return jsonResponse({ accessToken: "new-access", refreshToken: "new-refresh" });
      }
      protectedTokens.push(request.headers.get("authorization"));
      return request.headers.get("authorization") === "Bearer new-access"
        ? jsonResponse({ ok: true })
        : jsonResponse({ error: "expired" }, 401);
    }));

    const [first, second] = await Promise.all([
      baseQueryWithRefresh({ url: "/protected/one" }, api, {}),
      baseQueryWithRefresh({ url: "/protected/two" }, api, {}),
    ]);

    expect(first.data).toEqual({ ok: true });
    expect(second.data).toEqual({ ok: true });
    expect(refreshCalls).toBe(1);
    expect(protectedTokens).toEqual([
      "Bearer expired-access",
      "Bearer expired-access",
      "Bearer new-access",
      "Bearer new-access",
    ]);
    expect(api.getState().auth).toMatchObject({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
    expect(JSON.parse(storage.get("campus-mind.session"))).toMatchObject({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
  });

  it("signs out once and returns the same unauthenticated error to all refresh waiters", async () => {
    const api = createApi();
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: "invalid refresh" }, 401)));

    const results = await Promise.all([
      baseQueryWithRefresh({ url: "/protected/one" }, api, {}),
      baseQueryWithRefresh({ url: "/protected/two" }, api, {}),
    ]);

    expect(results).toEqual([
      { error: { status: 401, data: { error: "Unauthenticated" } } },
      { error: { status: 401, data: { error: "Unauthenticated" } } },
    ]);
    expect(api.actions.filter((action) => action.type === "auth/forcedSignOut")).toHaveLength(1);
  });

  it("does not refresh again when the one allowed retry also receives a 401", async () => {
    const api = createApi();
    let refreshCalls = 0;
    vi.stubGlobal("fetch", vi.fn(async (request) => {
      if (new URL(request.url).pathname.endsWith("/auth/refresh")) {
        refreshCalls += 1;
        return jsonResponse({ accessToken: "new-access", refreshToken: "new-refresh" });
      }
      return jsonResponse({ error: "still unauthorized" }, 401);
    }));

    const result = await baseQueryWithRefresh({ url: "/protected" }, api, {});

    expect(refreshCalls).toBe(1);
    expect(result).toEqual({ error: { status: 401, data: { error: "still unauthorized" } } });
  });

  it("migrates legacy flat and nested session records to the canonical shape", () => {
    storage.set("campus-mind.session", JSON.stringify({
      session: { accessToken: "access", refreshToken: "refresh", user: { id: "user-1" } },
    }));

    expect(readPersistedSession()).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
      user: { id: "user-1" },
    });
    expect(JSON.parse(storage.get("campus-mind.session"))).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
      user: { id: "user-1" },
    });

    storage.set("campus-mind.session", JSON.stringify({
      accessToken: "flat-access", refreshToken: "flat-refresh", id: "user-2",
    }));
    expect(readPersistedSession()).toEqual({
      accessToken: "flat-access",
      refreshToken: "flat-refresh",
      user: { id: "user-2" },
    });
  });

  it("keeps refreshed credentials while committing startup validation and profile hydration", () => {
    const refreshedState = {
      auth: { accessToken: "rotated-access", refreshToken: "rotated-refresh", user: { id: "user-1", name: "Before" } },
    };
    const getState = () => refreshedState;

    const startupCommit = mergeProfileIntoCurrentSession(getState, { displayName: "Validated" });
    const hydrationCommit = mergeProfileIntoCurrentSession(getState, { avatarUrl: "new-avatar" });

    expect(startupCommit).toMatchObject({
      accessToken: "rotated-access",
      refreshToken: "rotated-refresh",
      user: { name: "Validated" },
    });
    expect(hydrationCommit).toMatchObject({
      accessToken: "rotated-access",
      refreshToken: "rotated-refresh",
      user: { avatar: "new-avatar" },
    });
  });
});
