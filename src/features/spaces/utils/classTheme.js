/**
 * Curated theme presets for classrooms with high-contrast, accessible gradients
 * and corresponding solid swatch colors.
 */
export const CLASSROOM_THEMES = [
  {
    id: "indigo",
    name: "Indigo",
    swatchClass: "bg-indigo-600",
    gradientClass: "bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700",
    colorHex: "#4f46e5",
    badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "emerald",
    name: "Emerald",
    swatchClass: "bg-emerald-600",
    gradientClass: "bg-gradient-to-r from-emerald-600 via-teal-700 to-teal-800",
    colorHex: "#059669",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "violet",
    name: "Violet",
    swatchClass: "bg-violet-600",
    gradientClass: "bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-800",
    colorHex: "#7c3aed",
    badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    id: "amber",
    name: "Amber",
    swatchClass: "bg-amber-600",
    gradientClass: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-700",
    colorHex: "#d97706",
    badgeClass: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  },
  {
    id: "rose",
    name: "Rose",
    swatchClass: "bg-rose-600",
    gradientClass: "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700",
    colorHex: "#e11d48",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    id: "cyan",
    name: "Cyan",
    swatchClass: "bg-cyan-600",
    gradientClass: "bg-gradient-to-r from-cyan-600 via-sky-700 to-blue-800",
    colorHex: "#0891b2",
    badgeClass: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "slate",
    name: "Slate",
    swatchClass: "bg-slate-800",
    gradientClass: "bg-gradient-to-r from-slate-800 via-zinc-800 to-neutral-900",
    colorHex: "#1e293b",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  },
  {
    id: "terracotta",
    name: "Terracotta",
    swatchClass: "bg-[#b85c47]",
    gradientClass: "bg-gradient-to-r from-[#b85c47] via-[#934633] to-[#733626]",
    colorHex: "#b85c47",
    badgeClass: "bg-[#b85c47]/10 text-[#b85c47] dark:text-[#d98c70]",
  },
];

const THEME_MAP = new Map(CLASSROOM_THEMES.map((t) => [t.id, t]));

/**
 * Subject-based deterministic mapping to match courses to fitting academic palettes
 */
const SUBJECT_THEME_MAP = {
  mathematics: "indigo",
  science: "emerald",
  "computer science": "cyan",
  history: "amber",
  art: "rose",
  music: "violet",
  "physical education": "terracotta",
  "foreign language": "violet",
  english: "indigo",
};

/**
 * Generates a stable deterministic hash from an identifier string
 */
function hashString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Resolves the theme object for a classroom.
 * Checks:
 * 1. Explicit classroom.theme (if matches a preset)
 * 2. Deterministic match by subject
 * 3. Deterministic hash of courseId or title
 * 
 * @param {Object} classroom
 * @returns {typeof CLASSROOM_THEMES[0]}
 */
export function getClassTheme(classroom = {}) {
  // 1. Direct match by theme id or legacy name/value
  const themeKey = String(classroom?.theme || "").toLowerCase().trim();
  if (THEME_MAP.has(themeKey)) {
    return THEME_MAP.get(themeKey);
  }

  // Handle legacy values like "bg-slate-900 text-white"
  for (const theme of CLASSROOM_THEMES) {
    if (themeKey.includes(theme.id)) {
      return theme;
    }
  }

  // 2. Deterministic match by subject
  const subjectKey = String(classroom?.subject || "").toLowerCase().trim();
  if (SUBJECT_THEME_MAP[subjectKey]) {
    return THEME_MAP.get(SUBJECT_THEME_MAP[subjectKey]);
  }

  // 3. Fallback deterministic hash by ID or title
  const seed = classroom?.courseId || classroom?.id || classroom?._id || classroom?.title || "default";
  const index = hashString(seed) % CLASSROOM_THEMES.length;
  return CLASSROOM_THEMES[index];
}
