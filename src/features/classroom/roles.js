const TEACHER_ROLES = new Set(["created", "teacher", "owner"]);

export function isTeacherRole(role) {
  return (
    typeof role === "string" && TEACHER_ROLES.has(role.trim().toLowerCase())
  );
}
