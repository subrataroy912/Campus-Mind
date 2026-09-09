import { describe, expect, it } from "vitest";
import exploreReducer, {
  clearExploreState,
  setClassFilter,
  setPersonFilter,
  setSearchQuery,
  setTab,
} from "./exploreSlice.js";

describe("exploreSlice", () => {
  it("updates the explore tab and filters", () => {
    const first = exploreReducer(undefined, setTab("people"));
    const second = exploreReducer(first, setClassFilter("popular"));
    const third = exploreReducer(second, setPersonFilter("shared"));
    const fourth = exploreReducer(third, setSearchQuery("math"));

    expect(fourth.tab).toBe("people");
    expect(fourth.classFilter).toBe("popular");
    expect(fourth.personFilter).toBe("shared");
    expect(fourth.searchQuery).toBe("math");
  });

  it("resets the explore state to defaults", () => {
    const state = exploreReducer(undefined, setSearchQuery("biology"));
    const reset = exploreReducer(state, clearExploreState());

    expect(reset.tab).toBe("classes");
    expect(reset.searchQuery).toBe("");
    expect(reset.classFilter).toBe("all");
    expect(reset.personFilter).toBe("all");
  });
});
