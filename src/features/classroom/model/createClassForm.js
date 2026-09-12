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

export const GRADE_LEVELS = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "College",
  "Other",
];

import { CLASSROOM_THEMES } from "../utils/classTheme.js";

export const THEME_COLORS = CLASSROOM_THEMES.map((t) => ({
  id: t.id,
  name: t.name,
  value: t.id,
  swatchClass: t.swatchClass,
  colorHex: t.colorHex,
  gradientClass: t.gradientClass,
}));

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const INITIAL_CLASS_FORM = {
  className: "",
  section: "",
  subject: "",
  customSubject: "",
  room: "",
  description: "",
  gradeLevel: "",
  customGradeLevel: "",
  days: [],
  startTime: "",
  endTime: "",
  accessType: "invite",
  theme: "indigo",
  coverImage: null,
  logoImage: null,
};
