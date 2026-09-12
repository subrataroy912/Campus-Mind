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

export const THEME_COLORS = [
  { name: "Slate", value: "bg-slate-900 text-white" },
  { name: "Indigo", value: "bg-indigo-600 text-white" },
  { name: "Emerald", value: "bg-emerald-600 text-white" },
  { name: "Violet", value: "bg-violet-600 text-white" },
  { name: "Amber", value: "bg-amber-500 text-slate-950" },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const INITIAL_CLASS_FORM = {
  className: "",
  section: "",
  subject: "",
  room: "",
  description: "",
  gradeLevel: "",
  days: [],
  startTime: "",
  endTime: "",
  accessType: "invite",
  theme: THEME_COLORS[0].value,
  coverImage: null,
  logoImage: null,
};
