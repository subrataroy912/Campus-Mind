import { describe, expect, it } from "vitest";
import { store } from "./store.js";
import { forcedSignOut, setSession } from "@/features/auth/authSlice.js";
import { setCommunityDraft } from "@/features/dashboard/dashboardSlice.js";
import { setNotifications } from "@/features/settings/settingsSlice.js";
import { setProfileEditing } from "@/features/profile/profileSlice.js";
import { setClassroomTab } from "@/features/classroom/classroomSlice.js";

describe("root forced sign-out", () => {
  it("clears user-scoped drafts and settings while retaining device-scoped UI state", () => {
    store.dispatch(
      setSession({ accessToken: "user-one", user: { id: "one" } })
    );
    store.dispatch(setCommunityDraft("private draft"));
    store.dispatch(setNotifications({ emailEnabled: false }));
    store.dispatch(setProfileEditing(true));
    store.dispatch(setClassroomTab("members"));
    const uiBefore = store.getState().ui;

    store.dispatch(forcedSignOut());

    expect(store.getState().auth).toEqual({ accessToken: null, user: null });
    expect(store.getState().dashboard.draft).toBe("");
    expect(store.getState().settings.notifications.emailEnabled).toBe(true);
    expect(store.getState().profile.isEditing).toBe(false);
    expect(store.getState().classroom.activeTab).toBe("home");
    expect(store.getState().ui).toEqual(uiBefore);
  });
});
