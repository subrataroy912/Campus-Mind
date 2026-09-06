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
  "College / Adult",
];

export const THEME_COLORS = [
  { name: "Indigo", value: "bg-primary" },
  { name: "Emerald", value: "bg-success" },
  { name: "Rose", value: "bg-secondary" },
  { name: "Amber", value: "bg-secondary" },
  { name: "Sky", value: "bg-accent" },
  { name: "Violet", value: "bg-primary" },
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
};
