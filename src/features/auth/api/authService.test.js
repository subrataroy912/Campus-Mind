import { describe, expect, it } from "vitest";
import { normalizeAuthResponse } from "./authService.js";

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
      },
    });
  });

  it("keeps compatibility with nested token and user responses", () => {
    expect(
      normalizeAuthResponse({
        token: "access-token",
        user: { id: "user-1", name: "Campus Student" },
      }),
    ).toEqual({
      accessToken: "access-token",
      refreshToken: null,
      user: { id: "user-1", name: "Campus Student" },
    });
  });
});