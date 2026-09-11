import { afterEach, describe, expect, it, vi } from "vitest";
import { store } from "./store.js";
import { forcedSignOut, setSession } from "@/features/auth/authSlice.js";
import { setCommunityDraft } from "@/features/dashboard/dashboardSlice.js";
import { setNotifications } from "@/features/settings/settingsSlice.js";
import { setProfileEditing } from "@/features/profile/profileSlice.js";
import { setClassroomTab } from "@/features/classroom/classroomSlice.js";
import { readPersistedApiState } from "./apiCachePersistence.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it("reads the cached API state for the last known user even before Redux auth hydrates", () => {
    const storage = new Map();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
        removeItem: (key) => storage.delete(key),
      },
    });

    storage.set(
      "campus-mind.session",
      JSON.stringify({ accessToken: "token", user: { id: "user-42" } })
    );
    storage.set(
      "campus-mind.api-cache.v1",
      JSON.stringify({
        version: 1,
        userId: "user-42",
        savedAt: Date.now(),
        apiState: {
          queries: { fetchClassrooms: { endpointName: "fetchClassrooms" } },
        },
      })
    );

    expect(readPersistedApiState({ user: null })).toMatchObject({
      queries: { fetchClassrooms: { endpointName: "fetchClassrooms" } },
    });
  });
});
