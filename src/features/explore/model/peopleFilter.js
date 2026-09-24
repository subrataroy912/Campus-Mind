import { getSharedClassCount } from "@/utils/sharedClasses.js";

export const matches = (value = "", query = "") =>
  String(value).toLowerCase().includes(String(query).toLowerCase());

export function filterAndSortPeople(
  users = [],
  { searchQuery = "", personFilter = "all", currentUser = null } = {}
) {
  const trimmedQuery = searchQuery.trim();

  const selfResult =
    trimmedQuery &&
    currentUser &&
    matches(
      `${currentUser.name || ""} ${currentUser.handle || ""} ${
        currentUser.department || ""
      }`,
      trimmedQuery
    )
      ? [currentUser]
      : [];

  return [...selfResult, ...users]
    .filter((person) => {
      if (!person) return false;
      if (personFilter === "all") return true;
      if (personFilter === "recommended") {
        return (
          Boolean(person.recommendationReason) ||
          (person.sharedCoursesCount ?? 0) > 0 ||
          Boolean(person.sameDepartment) ||
          Boolean(person.canCreateCourses) ||
          getSharedClassCount(currentUser, person) > 0
        );
      }
      if (personFilter === "shared") {
        return (
          (person.sharedCoursesCount ?? 0) > 0 ||
          getSharedClassCount(currentUser, person) > 0
        );
      }
      return person.department === personFilter;
    })
    .filter((person) => {
      if (!trimmedQuery) return true;
      return matches(
        `${person.name || ""} ${person.handle || ""} ${
          person.department || ""
        }`,
        trimmedQuery
      );
    })
    .sort((a, b) => {
      if (personFilter === "recommended") {
        const scoreA =
          ((a.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, a)) * 10 +
          (a.sameDepartment || (a.department && a.department === currentUser?.department) ? 5 : 0) +
          (a.canCreateCourses ? 2 : 0);
        const scoreB =
          ((b.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, b)) * 10 +
          (b.sameDepartment || (b.department && b.department === currentUser?.department) ? 5 : 0) +
          (b.canCreateCourses ? 2 : 0);
        if (scoreB !== scoreA) return scoreB - scoreA;
      }

      const sharedA = (a.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, a);
      const sharedB = (b.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, b);
      const sharedDiff = sharedB - sharedA;
      if (sharedDiff !== 0) return sharedDiff;

      const deptA = Number(Boolean(a.department && a.department === currentUser?.department));
      const deptB = Number(Boolean(b.department && b.department === currentUser?.department));
      const deptDiff = deptB - deptA;
      if (deptDiff !== 0) return deptDiff;

      return (a.name || "").localeCompare(b.name || "");
    });
}
