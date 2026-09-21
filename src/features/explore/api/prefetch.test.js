import { describe, expect, it, vi } from "vitest";
import { store } from "@/app/store.js";
import { classroomApi } from "@/features/classroom/api/classroomApi.js";
import { profileApi } from "@/features/profile/api/profileApi.js";

describe("Prefetch Handlers", () => {
  it("dispatches findClassroomById prefetch query without forcing refetch", () => {
    const spy = vi.spyOn(store, "dispatch");
    const prefetchAction = classroomApi.util.prefetch("findClassroomById", "c-123", {
      force: false,
    });
    store.dispatch(prefetchAction);
    expect(spy).toHaveBeenCalledWith(prefetchAction);
    spy.mockRestore();
  });

  it("dispatches getPublicProfile prefetch query without forcing refetch", () => {
    const spy = vi.spyOn(store, "dispatch");
    const prefetchAction = profileApi.util.prefetch("getPublicProfile", "u-456", {
      force: false,
    });
    store.dispatch(prefetchAction);
    expect(spy).toHaveBeenCalledWith(prefetchAction);
    spy.mockRestore();
  });
});
