import { afterEach, describe, expect, it, vi } from "vitest";
import { store } from "./store.js";
import { forcedSignOut, setSession } from "@/features/auth/authSlice.js";
import { readPersistedApiState } from "./apiCachePersistence.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("root forced sign-out", () => {
  it("clears user credentials while retaining device-scoped UI state", () => {
    store.dispatch(
      setSession({ accessToken: "user-one", user: { id: "one" } })
    );
    const uiBefore = store.getState().ui;

    store.dispatch(forcedSignOut());

    expect(store.getState().auth).toEqual({ accessToken: null, user: null });
    expect(store.getState().ui).toEqual(uiBefore);
  });

  it("reads the cached API state for the last known user even before Redux auth hydrates", () => {
    const storage = new Map();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
        removeItem: (key) => storage.delete(key),
      },
    });

    storage.set(
      "campus-mind.session",
      JSON.stringify({ accessToken: "token", user: { id: "user-42" } })
    );
    storage.set(
      "campus-mind.api-cache.v1",
      JSON.stringify({
        version: 1,
        userId: "user-42",
        savedAt: Date.now(),
        apiState: {
          queries: { fetchClassrooms: { endpointName: "fetchClassrooms" } },
        },
      })
    );

    expect(readPersistedApiState({ user: null })).toMatchObject({
      queries: { fetchClassrooms: { endpointName: "fetchClassrooms" } },
    });
  });
});
