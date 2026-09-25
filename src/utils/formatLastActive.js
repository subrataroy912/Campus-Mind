/**
 * Formats a user's online/last-active state into a concise human-readable label.
 *
 * @param {string|number|Date|null|undefined} lastActiveAt
 * @param {boolean} [isOnline=false]
 * @param {object} [options]
 * @param {boolean} [options.shortOnline=false] - Return "Online" instead of "Online now"
 * @returns {string}
 */
export function formatLastActive(lastActiveAt, isOnline = false, options = {}) {
  const { shortOnline = false } = options;
  if (isOnline) {
    return shortOnline ? "Online" : "Online now";
  }
  if (!lastActiveAt) {
    return "Offline";
  }

  const timestamp = new Date(lastActiveAt).getTime();
  if (Number.isNaN(timestamp)) {
    return "Offline";
  }

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 90) {
    return "Active just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `Active ${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Active ${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `Active ${diffDays}d ago`;
  }

  return `Active ${new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })}`;
}
