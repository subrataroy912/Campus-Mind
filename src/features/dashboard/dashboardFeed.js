export function selectDashboardFeed(exploreClassrooms = []) {
  return [...exploreClassrooms]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);
}
