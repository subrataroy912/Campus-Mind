import { describe, expect, it } from "vitest";
import { getEventRefreshTargets } from "./refreshEvents.js";

describe("getEventRefreshTargets", () => {
  it("maps auth, profile, and notification lifecycle events to the relevant RTK Query tags", () => {
    expect(getEventRefreshTargets("user-registered")).toEqual(["Profile", "Classrooms"]);
    expect(getEventRefreshTargets("user-profile-updated")).toEqual(["Profile"]);
    expect(getEventRefreshTargets("user-profile-visibility-changed")).toEqual(["Profile"]);
    expect(getEventRefreshTargets("course-created")).toEqual(["Classrooms"]);
    expect(getEventRefreshTargets("coursework-published")).toEqual(["Classrooms", "Profile"]);
    expect(getEventRefreshTargets("submission-graded")).toEqual(["Classrooms", "Profile"]);
    expect(getEventRefreshTargets("notifications-updated")).toEqual(["Notifications"]);
    expect(getEventRefreshTargets("notification-marked-read")).toEqual(["Notifications"]);
  });

  it("returns an empty array for unknown lifecycle events", () => {
    expect(getEventRefreshTargets("unknown-event")).toEqual([]);
  });
});
