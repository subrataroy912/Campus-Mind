import { describe, expect, it } from "vitest";
import {
  getHydrationFailureError,
  getProfileUpdateLifecycleEvent,
  toProfilePatch,
} from "./authContextUtils.js";

describe("profile update diff", () => {
  it("omits unchanged profile visibility and uses the generic lifecycle event", () => {
    const patch = toProfilePatch(
      { profileVisibility: "PUBLIC", headline: "New headline" },
      { profileVisibility: "PUBLIC", headline: "Old headline" }
    );

    expect(patch).toEqual({ headline: "New headline" });
    expect(getProfileUpdateLifecycleEvent(patch)).toBe("user-profile-updated");
  });

  it("uses the visibility lifecycle event only when visibility is in the diff", () => {
    expect(
      getProfileUpdateLifecycleEvent({ profileVisibility: "PRIVATE" })
    ).toBe("user-profile-visibility-changed");
  });
});

describe("hydration failure error", () => {
  it("preserves the specific hydration error instead of the generic fallback", () => {
    const error = new Error("Your profile could not be loaded.");

    expect(getHydrationFailureError(error)).toBe(error);
    expect(getHydrationFailureError(error).message).toBe(
      "Your profile could not be loaded."
    );
  });
});
