import { afterEach, describe, expect, it, vi } from "vitest";
import { clearLocalAuthSession } from "@/context/authSession.js";
import { logoutFromHeader } from "./headerLogout.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("DashboardHeader logout", () => {
  it("navigates to the public route and cannot restore the session after reload", async () => {
    const localStorage = createStorage();
    vi.stubGlobal("window", { localStorage });
    localStorage.setItem(
      "campus-mind.session",
      JSON.stringify({
        accessToken: "access-token",
        user: { id: "student-1" },
      })
    );
    localStorage.setItem("campus-mind.api-cache.v1", "cached-query-state");

    const dispatch = vi.fn();
    const clearContextUser = vi.fn();
    const navigate = vi.fn();
    const logout = vi.fn(async () => {
      clearLocalAuthSession(dispatch, clearContextUser);
    });

    await logoutFromHeader(logout, navigate);

    expect(clearContextUser).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem("campus-mind.session")).toBeNull();
    expect(localStorage.getItem("campus-mind.api-cache.v1")).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/auth/login", { replace: true });

    vi.resetModules();
    const { default: authReducer } = await import(
      "@/features/auth/authSlice.js"
    );
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({
      accessToken: null,
      user: null,
    });
  });
});
