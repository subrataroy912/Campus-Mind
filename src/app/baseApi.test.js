import { describe, expect, it, vi } from "vitest";
import { shouldForceLogout } from "./baseApi.js";

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

    const { default: authReducer } = await import("../features/auth/authSlice.js");

    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
    });

    vi.unstubAllGlobals();
    vi.resetModules();
  });
});
