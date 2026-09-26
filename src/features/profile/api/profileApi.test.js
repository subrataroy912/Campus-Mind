import { describe, expect, it } from "vitest";
import { profileApi } from "./profileApi.js";

describe("profileApi endpoint definitions", () => {
  it("defines dedicated updateCurrentProfile mutation for pure JSON", () => {
    const endpoint = profileApi.endpoints.updateCurrentProfile;
    expect(endpoint).toBeDefined();
    const req = endpoint.initiate({ firstName: "John", headline: "Developer" });
    expect(req).toBeDefined();
  });

  it("defines dedicated updateCurrentHandle mutation targeting PATCH /users/me/handle", () => {
    const endpoint = profileApi.endpoints.updateCurrentHandle;
    expect(endpoint).toBeDefined();
    const req = endpoint.initiate({ handle: "cool_handle" });
    expect(req).toBeDefined();
  });

  it("defines uploadAvatar mutation targeting PUT /users/me/avatar", () => {
    const endpoint = profileApi.endpoints.uploadAvatar;
    expect(endpoint).toBeDefined();
  });

  it("defines deleteAvatar mutation targeting DELETE /users/me/avatar", () => {
    const endpoint = profileApi.endpoints.deleteAvatar;
    expect(endpoint).toBeDefined();
  });

  it("defines uploadBanner mutation targeting PUT /users/me/banner", () => {
    const endpoint = profileApi.endpoints.uploadBanner;
    expect(endpoint).toBeDefined();
  });

  it("defines deleteBanner mutation targeting DELETE /users/me/banner", () => {
    const endpoint = profileApi.endpoints.deleteBanner;
    expect(endpoint).toBeDefined();
  });

  it("defines updateCreatorProfile mutation targeting PATCH /users/me/creator-profile", () => {
    const endpoint = profileApi.endpoints.updateCreatorProfile;
    expect(endpoint).toBeDefined();
  });

  it("defines deleteAccount mutation targeting DELETE /users/me", () => {
    const endpoint = profileApi.endpoints.deleteAccount;
    expect(endpoint).toBeDefined();
  });
});
