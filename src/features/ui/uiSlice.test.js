import { describe, expect, it } from "vitest";
import uiReducer, {
  clearUIState,
  setMobileMenuOpen,
  setSidebarOpen,
  toggleSidebar,
} from "./uiSlice.js";

describe("uiSlice", () => {
  it("toggles the sidebar state", () => {
    const first = uiReducer(undefined, toggleSidebar());
    expect(first.isSidebarOpen).toBe(false);

    const second = uiReducer(first, toggleSidebar());
    expect(second.isSidebarOpen).toBe(true);
  });

  it("sets mobile menu and sidebar values explicitly", () => {
    const first = uiReducer(undefined, setSidebarOpen(false));
    const second = uiReducer(first, setMobileMenuOpen(true));

    expect(second.isSidebarOpen).toBe(false);
    expect(second.isMobileMenuOpen).toBe(true);
  });

  it("resets the UI state back to defaults", () => {
    const state = uiReducer(undefined, setSidebarOpen(false));
    const reset = uiReducer(state, clearUIState());

    expect(reset.isSidebarOpen).toBe(true);
    expect(reset.isMobileMenuOpen).toBe(false);
  });
});
