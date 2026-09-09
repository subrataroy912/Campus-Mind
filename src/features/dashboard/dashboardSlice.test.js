import { describe, expect, it } from "vitest";
import dashboardReducer, {
  clearDashboardState,
  setCommunityFilter,
  setCommunityDraft,
} from "./dashboardSlice.js";

describe("dashboardSlice", () => {
  it("updates the community filter and draft text", () => {
    const first = dashboardReducer(undefined, setCommunityFilter("question"));
    const second = dashboardReducer(first, setCommunityDraft("Looking for notes"));

    expect(second.communityFilter).toBe("question");
    expect(second.draft).toBe("Looking for notes");
  });

  it("resets dashboard feature state to defaults", () => {
    const state = dashboardReducer(undefined, setCommunityDraft("hello world"));
    const reset = dashboardReducer(state, clearDashboardState());

    expect(reset.communityFilter).toBe("all");
    expect(reset.draft).toBe("");
  });
});
