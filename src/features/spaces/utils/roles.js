const STAFF_ROLES = new Set(["owner", "admin", "created"]);
export const SPACES_VIEW_MODE_KEY = "campus_mind_spaces_view_mode";

export function getSpaceId(space) {
  return (
    space?.id ?? space?.courseId ?? space?.classId ?? space?._id ?? ""
  );
}

export function isSpaceOwner(space, userId) {
  const role = String(space?.role || "").toUpperCase();
  return (
    role === "OWNER" ||
    role === "CREATED" ||
    (Boolean(userId) && space?.ownerId === userId)
  );
}

export function getSavedSpacesViewMode() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(SPACES_VIEW_MODE_KEY) || "list";
    }
  } catch {
    // storage disabled / unsupported
  }
  return "list";
}

export function saveSpacesViewMode(mode) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(SPACES_VIEW_MODE_KEY, mode);
    }
  } catch {
    // storage disabled / unsupported
  }
}

export function isStaffRole(role) {
  return (
    typeof role === "string" && STAFF_ROLES.has(role.trim().toLowerCase())
  );
}

export const isAdminOrOwner = isStaffRole;

export function isUserEnrolled(classroom, userId) {
  if (!classroom) return false;
  if (
    classroom.membershipStatus === "PENDING" ||
    classroom.membershipStatus === "REJECTED"
  ) {
    return false;
  }
  if (classroom.isEnrolled === true || classroom.enrolled === true) return true;
  if (
    classroom.isEnrolled === false ||
    classroom.enrolled === false ||
    String(classroom.role || "").toUpperCase() === "VIEWER"
  ) {
    return false;
  }
  if (
    userId &&
    (classroom.ownerId === userId ||
      classroom.creatorId === userId)
  ) {
    return true;
  }
  if (classroom.role && String(classroom.role).toUpperCase() !== "VIEWER") {
    return true;
  }
  return false;
}

