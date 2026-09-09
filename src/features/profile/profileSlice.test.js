import { describe, expect, it } from "vitest";
import profileReducer, {
  clearProfileState,
  setProfileEditing,
  setProfilePreview,
  setProfileSaving,
  setProfileTab,
} from "./profileSlice.js";

describe("profileSlice", () => {
  it("updates profile tab and editing state", () => {
    const first = profileReducer(undefined, setProfileTab("saved"));
    const second = profileReducer(first, setProfileEditing(true));
    const third = profileReducer(second, setProfileSaving(true));
    const fourth = profileReducer(third, setProfilePreview(true));

    expect(fourth.activeTab).toBe("saved");
    expect(fourth.isEditing).toBe(true);
    expect(fourth.isSaving).toBe(true);
    expect(fourth.preview).toBe(true);
  });

  it("resets the profile state to defaults", () => {
    const state = profileReducer(undefined, setProfileTab("saved"));
    const reset = profileReducer(state, clearProfileState());

    expect(reset.activeTab).toBe("classes");
    expect(reset.isEditing).toBe(false);
    expect(reset.isSaving).toBe(false);
    expect(reset.preview).toBe(false);
  });
});
