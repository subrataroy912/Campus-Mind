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
      if (personFilter === "shared") {
        return getSharedClassCount(currentUser, person) > 0;
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
      const sharedDiff =
        getSharedClassCount(currentUser, b) - getSharedClassCount(currentUser, a);
      if (sharedDiff !== 0) return sharedDiff;

      const deptA = Number(Boolean(a.department && a.department === currentUser?.department));
      const deptB = Number(Boolean(b.department && b.department === currentUser?.department));
      const deptDiff = deptB - deptA;
      if (deptDiff !== 0) return deptDiff;

      return (a.name || "").localeCompare(b.name || "");
    });
}
