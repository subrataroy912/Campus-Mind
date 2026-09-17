export const SPACE_TYPES = [
  {
    id: "ACADEMIC_CLASS",
    label: "Academic Class",
    badge: "Class",
    icon: "GraduationCap",
    description:
      "Structured course or classroom with assignments, syllabus, and discussions.",
    categoryLabel: "Academic Subject",
    levelLabel: "Target Grade / Level",
  },
  {
    id: "STUDY_GROUP",
    label: "Study Group",
    badge: "Study Circle",
    icon: "BookOpen",
    description:
      "Peer-led group for exam preparation, collaborative homework, and deep problem solving.",
    categoryLabel: "Subject / Focus Area",
    levelLabel: "Experience / Level (Optional)",
  },
  {
    id: "CLUB_SOCIETY",
    label: "Club & Society",
    badge: "Club",
    icon: "Users",
    description:
      "Student club, cultural organization, campus society, or special interest circle.",
    categoryLabel: "Club Category",
    levelLabel: "Audience / Cohort (Optional)",
  },
  {
    id: "PROJECT_TEAM",
    label: "Project Team & Lab",
    badge: "Team",
    icon: "FolderKanban",
    description:
      "Hackathon team, capstone project, research lab, or creative collaborative group.",
    categoryLabel: "Domain / Tech Stack",
    levelLabel: "Stage / Goal (Optional)",
  },
  {
    id: "DEPARTMENT_COHORT",
    label: "Department & Cohort",
    badge: "Cohort",
    icon: "Building2",
    description:
      "Official academic department, batch year, alumni group, or faculty council.",
    categoryLabel: "Department / Major",
    levelLabel: "Graduation Year / Batch",
  },
  {
    id: "COMMUNITY_HUB",
    label: "Community Hub",
    badge: "Community",
    icon: "Globe",
    description:
      "Open campus space for campus networking, hobby exchange, and general discussions.",
    categoryLabel: "Hub Focus",
    levelLabel: "Membership Scope (Optional)",
  },
];

export const MEETING_TYPES = [
  {
    id: "IN_PERSON",
    label: "In-Person",
  },
  {
    id: "ONLINE",
    label: "Online",
  },
  {
    id: "HYBRID",
    label: "Hybrid",
  },
];

export const SUBJECTS = [
  "Computer Science & Tech",
  "Engineering",
  "Mathematics",
  "Natural Sciences",
  "Business & Economics",
  "Humanities & Arts",
  "Social Sciences",
  "Health & Medicine",
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

export const INITIAL_SPACE_FORM = {
  spaceType: "ACADEMIC_CLASS",
  title: "",
  className: "",
  section: "",
  subject: "",
  customSubject: "",
  description: "",
  meetingType: "IN_PERSON",
  location: "",
  room: "",
  tags: [],
  accessType: "CODE",
  visibility: "PRIVATE",
  theme: "indigo",
  coverImage: null,
  logoImage: null,
  gradeLevel: "",
  customGradeLevel: "",
  days: [],
  startTime: "",
  endTime: "",
};

export const INITIAL_CLASS_FORM = INITIAL_SPACE_FORM;

export const ACCESS_OPTIONS = [
  {
    id: "CODE",
    label: "Class Code",
    visibility: "PRIVATE",
  },
  {
    id: "OPEN",
    label: "Open / Public",
    visibility: "PUBLIC",
  },
  {
    id: "INVITE",
    label: "Invite Only",
    visibility: "PRIVATE",
  },
];

export const ACCESS_TYPES = [
  { value: "OPEN", label: "Open (Public)" },
  { value: "CODE", label: "Code Protected" },
  { value: "INVITE", label: "Invite Only" },
];
