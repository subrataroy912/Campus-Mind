import { baseApi } from "@/app/baseApi.js";

const EVENT_REFRESH_MAP = {
  "user-registered": ["Profile", "Classrooms"],
  "user-logged-in": ["Profile", "Classrooms"],
  "user-profile-updated": ["Profile"],
  "user-oauth-linked": ["Profile"],
  "user-profile-visibility-changed": ["Profile"],
  "course-created": ["Classrooms"],
  "coursework-published": ["Classrooms", "Profile"],
  "submission-graded": ["Classrooms", "Profile"],
  "notifications-updated": ["Notifications"],
  "notification-marked-read": ["Notifications"],
};

export function getEventRefreshTargets(eventName) {
  return EVENT_REFRESH_MAP[eventName] ?? [];
}

export function triggerLifecycleRefresh(dispatch, eventName) {
  const targets = getEventRefreshTargets(eventName);
  if (!targets.length || !dispatch) return;
  dispatch(baseApi.util.invalidateTags(targets));
}
