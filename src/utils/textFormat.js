export function formatDisplayText(value) {
  if (!value || typeof value !== "string") return "";
  const cleaned = value.trim();
  if (!cleaned) return "";

  const dictionary = {
    STUDENT: "Student",
    TEACHER: "Teacher",
    ADMIN: "Admin",
    PRIVATE: "Private",
    PUBLIC: "Public",
    COURSE_MEMBERS: "Course Members",
    ACTIVE: "Active",
    ARCHIVED: "Archived",
    ASSIGNED: "Assigned",
    SUBMITTED: "Submitted",
    GRADED: "Graded",
    LATE: "Late",
    MISSING: "Missing",
  };

  if (dictionary[cleaned]) {
    return dictionary[cleaned];
  }

  return cleaned
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
