import { getSharedClassCount } from "@/utils/sharedClasses.js";

export const matches = (value = "", query = "") =>
  String(value).toLowerCase().includes(String(query).toLowerCase());

export function filterAndSortPeople(
  users = [],
  { searchQuery = "", personFilter = "all", currentUser = null } = {},
) {
  const trimmedQuery = searchQuery.trim();

  const selfResult =
    trimmedQuery &&
    currentUser &&
    matches(`${currentUser.name || ""} ${currentUser.handle || ""}`, trimmedQuery)
      ? [currentUser]
      : [];

  return [...selfResult, ...users]
    .filter((person) => {
      if (!person) return false;
      if (selfResult.includes(person)) return true;

      const sharedCount =
        (person.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, person);
      const mutualCount = person.mutualPeersCount ?? 0;

      if (personFilter === "mutual") {
        return (
          person.recommendationReason === "MUTUAL_SPACE_PEERS" || mutualCount > 0
        );
      }

      if (personFilter === "shared") {
        return (
          person.recommendationReason === "SHARED_SPACES" || sharedCount > 0
        );
      }

      // "all" or "recommended": must have shared spaces or mutual space peers
      return (
        sharedCount > 0 ||
        mutualCount > 0 ||
        person.recommendationReason === "SHARED_SPACES" ||
        person.recommendationReason === "MUTUAL_SPACE_PEERS"
      );
    })
    .filter((person) => {
      if (!trimmedQuery) return true;
      return matches(
        `${person.name || ""} ${person.handle || ""}`,
        trimmedQuery,
      );
    })
    .sort((a, b) => {
      const sharedA =
        (a.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, a);
      const sharedB =
        (b.sharedCoursesCount ?? 0) || getSharedClassCount(currentUser, b);
      const mutualA = a.mutualPeersCount ?? 0;
      const mutualB = b.mutualPeersCount ?? 0;

      const scoreA = sharedA * 10 + mutualA * 3;
      const scoreB = sharedB * 10 + mutualB * 3;
      if (scoreB !== scoreA) return scoreB - scoreA;

      return (a.name || "").localeCompare(b.name || "");
    });
}
