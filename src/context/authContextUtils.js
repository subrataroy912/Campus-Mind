const PROFILE_FIELDS = {
  name: "displayName",
  firstName: "firstName",
  lastName: "lastName",
  handle: "handle",
  headline: "headline",
  bio: "about",
  avatar: "avatarUrl",
  banner: "bannerUrl",
  city: "city",
  country: "country",
  batchYear: "gradeLevel",
  profileVisibility: "profileVisibility",
};

function normalizeImageField(value) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function toProfilePatch(formData, currentUser) {
  return Object.entries(PROFILE_FIELDS).reduce(
    (changes, [formField, apiField]) => {
      if (
        (formField === "avatar" && formData.avatarFile) ||
        (formField === "banner" && formData.bannerFile)
      ) {
        return changes;
      }
      const value = normalizeImageField(formData[formField]);
      const currentValue = normalizeImageField(
        currentUser?.[apiField] ?? currentUser?.[formField]
      );
      if (value !== currentValue) {
        changes[apiField] = value;
      }
      return changes;
    },
    {}
  );
}

export function getProfileUpdateLifecycleEvent(profilePatch) {
  return Object.prototype.hasOwnProperty.call(profilePatch, "profileVisibility")
    ? "user-profile-visibility-changed"
    : "user-profile-updated";
}

export function getHydrationFailureError(error) {
  return error instanceof Error
    ? error
    : new Error("Your session has expired. Please log in again.");
}
