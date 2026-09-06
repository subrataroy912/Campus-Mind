export const COLLECTIONS = [
  { id: "all", name: "All saved", count: null },
  { id: "midterm", name: "Midterm prep", count: 4 },
  { id: "group-project", name: "Group project ideas", count: 2 },
  { id: "unsorted", name: "Unsorted", count: 3 },
];

export const SAVED_ITEMS = [
  {
    id: 1,
    type: "post",
    title: "Clarification on Thursday's lab report format",
    meta: "Community feed · Ms. Patel · 2 days ago",
    snippet: "Quick answer on whether we need a hypothesis section — yes, and here's the rubric breakdown...",
    collection: "midterm",
  },
  {
    id: 2,
    type: "post",
    title: "Best study strategies for the unit 3 exam",
    meta: "Community feed · 14 replies · 5 days ago",
    snippet: "Thread with tips from classmates on flashcards, practice sets, and study group times.",
    collection: "midterm",
  },
  {
    id: 3,
    type: "resource",
    title: "Chapter 7 – Chemical Reactions (PDF)",
    meta: "Resource library · 2.4 MB · PDF",
    snippet: "Full chapter reading with annotated diagrams and practice problems.",
    collection: "midterm",
  },
  {
    id: 4,
    type: "resource",
    title: "Khan Academy: Balancing equations",
    meta: "Resource library · External link",
    snippet: "Video walkthrough referenced during Tuesday's lecture.",
    collection: "unsorted",
  },
  {
    id: 5,
    type: "resource",
    title: "Group project rubric and timeline",
    meta: "Resource library · DOCX",
    snippet: "Grading criteria and milestone dates for the semester project.",
    collection: "group-project",
  },
  {
    id: 6,
    type: "assignment",
    title: "Quiz: Periodic table trends",
    meta: "Due tomorrow · 10 questions",
    snippet: "Covers atomic radius, ionization energy, and electronegativity.",
    collection: "midterm",
  },
  {
    id: 7,
    type: "assignment",
    title: "Lab module: Titration simulation",
    meta: "Learning module · Not started",
    snippet: "Interactive simulation with a short reflection write-up at the end.",
    collection: "unsorted",
  },
  {
    id: 8,
    type: "assignment",
    title: "Group project proposal draft",
    meta: "Due in 6 days · Group task",
    snippet: "Outline your topic, roles, and a rough timeline for the final presentation.",
    collection: "group-project",
  },
];

export const TYPE_META = {
  post: { label: "Post", color: "bg-canvas text-accent" },
  resource: { label: "Resource", color: "bg-canvas text-success" },
  assignment: { label: "Assignment", color: "bg-border text-secondary-hover" },
};

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "post", label: "Posts" },
  { id: "resource", label: "Resources" },
  { id: "assignment", label: "Assignments" },
];
