/**
 * Utility functions for computing and persisting daily engagement streaks.
 */

const STORAGE_KEY = "campus_mind_streak_data";

export function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

export function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function calculateStreak(storedData, todayStr = getTodayDateString(), yesterdayStr = getYesterdayDateString()) {
  if (!storedData || typeof storedData.count !== "number") {
    return {
      count: 1,
      bestStreak: 1,
      lastActiveDate: todayStr,
      activeToday: true,
      weeklyDays: getInitialWeeklyStatus(todayStr),
    };
  }

  const { lastActiveDate, count, bestStreak = count } = storedData;

  // If already active today, keep streak
  if (lastActiveDate === todayStr) {
    return {
      ...storedData,
      activeToday: true,
      count: Math.max(1, count),
      bestStreak: Math.max(count, bestStreak),
    };
  }

  // If active yesterday, increment streak
  if (lastActiveDate === yesterdayStr) {
    const newCount = count + 1;
    return {
      ...storedData,
      count: newCount,
      bestStreak: Math.max(newCount, bestStreak),
      lastActiveDate: todayStr,
      activeToday: true,
      weeklyDays: updateWeeklyStatus(storedData.weeklyDays, todayStr),
    };
  }

  // Streak broken (gap > 1 day) -> reset to 1
  return {
    count: 1,
    bestStreak: Math.max(1, bestStreak),
    lastActiveDate: todayStr,
    activeToday: true,
    weeklyDays: getInitialWeeklyStatus(todayStr),
  };
}

export function loadUserStreak() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const updated = calculateStreak(parsed);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    }
  } catch {
    // Fallback to default
  }

  const defaultStreak = calculateStreak(null);
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStreak));
    }
  } catch {
    // Ignore storage errors
  }
  return defaultStreak;
}

function getInitialWeeklyStatus(todayStr) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date(todayStr).getDay() + 6) % 7; // Monday = 0
  return days.map((day, idx) => ({
    label: day,
    active: idx === currentDayIndex,
    isToday: idx === currentDayIndex,
  }));
}

function updateWeeklyStatus(weeklyDays = [], todayStr) {
  const currentDayIndex = (new Date(todayStr).getDay() + 6) % 7;
  if (!weeklyDays || weeklyDays.length !== 7) {
    return getInitialWeeklyStatus(todayStr);
  }
  return weeklyDays.map((d, idx) => ({
    ...d,
    active: idx === currentDayIndex ? true : d.active,
    isToday: idx === currentDayIndex,
  }));
}
