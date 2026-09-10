import { describe, expect, it } from "vitest";
import { store } from "./store.js";
import { forcedSignOut, setSession } from "@/features/auth/authSlice.js";
import { setCommunityDraft } from "@/features/dashboard/dashboardSlice.js";
import { setNotifications } from "@/features/settings/settingsSlice.js";
import { setProfileEditing } from "@/features/profile/profileSlice.js";
import { setClassroomTab } from "@/features/classroom/classroomSlice.js";
import { synchronizeExternalSession } from "@/context/authSession.js";

describe("root forced sign-out", () => {
  it("clears user-scoped drafts and settings while retaining device-scoped UI state", () => {
    store.dispatch(setSession({ accessToken: "user-one", refreshToken: "refresh-one", user: { id: "one" } }));
    store.dispatch(setCommunityDraft("private draft"));
    store.dispatch(setNotifications({ emailEnabled: false }));
    store.dispatch(setProfileEditing(true));
    store.dispatch(setClassroomTab("members"));
    const uiBefore = store.getState().ui;

    store.dispatch(forcedSignOut());

    expect(store.getState().auth).toEqual({ accessToken: null, refreshToken: null, user: null });
    expect(store.getState().dashboard.draft).toBe("");
    expect(store.getState().settings.notifications.emailEnabled).toBe(true);
    expect(store.getState().profile.isEditing).toBe(false);
    expect(store.getState().classroom.activeTab).toBe("home");
    expect(store.getState().ui).toEqual(uiBefore);
  });

  it("accepts a rotated session from another tab and invalidates prior API state", () => {
    store.dispatch(setCommunityDraft("old user's draft"));

    synchronizeExternalSession(store.dispatch, {
      accessToken: "rotated-access",
      refreshToken: "rotated-refresh",
      user: { id: "second-user" },
    });

    expect(store.getState().auth).toEqual({
      accessToken: "rotated-access",
      refreshToken: "rotated-refresh",
      user: { id: "second-user" },
    });
    expect(store.getState().dashboard.draft).toBe("");
  });

  it("clears the current tab when another tab removes its session", () => {
    store.dispatch(setSession({ accessToken: "access", refreshToken: "refresh", user: { id: "one" } }));
    store.dispatch(setNotifications({ pushEnabled: false }));

    synchronizeExternalSession(store.dispatch, null);

    expect(store.getState().auth.accessToken).toBeNull();
    expect(store.getState().settings.notifications.pushEnabled).toBe(true);
  });
});
