/**
 * Formats a due-date ISO string into a short, human-readable label.
 * Examples: "Today, 11:59 PM"  "Sep 20, 3:00 PM"  "Sep 20, 2025, 3:00 PM"
 * Returns null when the value is falsy or unparseable.
 */
export function formatDueDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86_400_000);
  const dayAfterStart = new Date(tomorrowStart.getTime() + 86_400_000);

  const timeStr = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (d >= todayStart && d < tomorrowStart) {
    return `Today, ${timeStr}`;
  }
  if (d >= tomorrowStart && d < dayAfterStart) {
    return `Tomorrow, ${timeStr}`;
  }

  const isThisYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(isThisYear ? {} : { year: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Returns a short relative label for a past timestamp.
 * Examples: "Just now"  "5m ago"  "2h ago"  "3d ago"  "Sep 5"
 */
export function formatRelativeDate(iso) {
  if (!iso) return null;

  const d = new Date(iso);
  const time = d.getTime();
  if (isNaN(time)) return null;

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - time) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const diffDays = Math.floor(diffSec / 86400);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

/**
 * Formats chat message timestamps (HH:MM if today, otherwise short Month Day).
 */
export function formatChatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Formats a date for Group profiles, About pages, or Headers.
 * @param {string} iso - The ISO date string from the backend.
 * @param {boolean} includeDay - If false, returns "September 2024" instead of "Sep 24, 2024".
 */
export function formatAbsoluteDate(iso, includeDay = true) {
  if (!iso) return null;

  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: includeDay ? "short" : "long",
    ...(includeDay && { day: "numeric" }),
  });
}

