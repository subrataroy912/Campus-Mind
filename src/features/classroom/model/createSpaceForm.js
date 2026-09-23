import { CLASSROOM_THEMES } from "../utils/classTheme.js";

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Foreign Language",
  "Other",
];

export const THEME_COLORS = CLASSROOM_THEMES.map((t) => ({
  id: t.id,
  name: t.name,
  value: t.id,
  swatchClass: t.swatchClass,
  colorHex: t.colorHex,
  gradientClass: t.gradientClass,
}));

export const INITIAL_SPACE_FORM = {
  className: "",
  section: "",
  subject: "",
  customSubject: "",
  description: "",
  accessType: "PUBLIC",
  theme: "indigo",
  coverImage: null,
  logoImage: null,
};
