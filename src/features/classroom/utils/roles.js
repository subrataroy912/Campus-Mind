const STAFF_ROLES = new Set(["owner", "admin", "created"]);

export function isStaffRole(role) {
  return (
    typeof role === "string" && STAFF_ROLES.has(role.trim().toLowerCase())
  );
}

export const isTeacherRole = isStaffRole;

export function isUserEnrolled(classroom, userId) {
  if (!classroom) return false;
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
      classroom.teacherId === userId ||
      classroom.creatorId === userId)
  ) {
    return true;
  }
  if (classroom.role && String(classroom.role).toUpperCase() !== "VIEWER") {
    return true;
  }
  return false;
}
