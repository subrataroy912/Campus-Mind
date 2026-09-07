export const CLASS_TABS = [
  { id: "home", label: "Home" },
  { id: "classwork", label: "Classwork" },
  { id: "members", label: "Members" },
  { id: "grades", label: "Grades" },
];

export const PINNED_ANNOUNCEMENT = {
  author: "Ms. Patel",
  time: "Pinned · Aug 25",
  content:
    "Welcome to Algebra II! Check the syllabus link in Quick links, and don't forget quizzes are every Friday.",
};

export const FEED_POSTS = [
  {
    id: 1,
    author: "Ms. Patel",
    time: "2 hours ago",
    content: "Reminder: Quiz 1 covers chapters 1–3. Practice set is under Classwork.",
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: "Daniel R.",
    time: "5 hours ago",
    content: "Can someone explain problem 14 from last night's homework? I keep getting a negative answer.",
    likes: 3,
    comments: 6,
  },
  {
    id: 3,
    author: "Ms. Patel",
    time: "Yesterday",
    content: "Great questions in class today on factoring — here's a short video recap for anyone who wants a refresher.",
    likes: 20,
    comments: 2,
  },
];

export const TODO_ITEMS = [
  { id: 1, title: "Quiz 1: Chapters 1–3", due: "Due tomorrow" },
  { id: 2, title: "Homework set 4", due: "Due in 3 days" },
  { id: 3, title: "Group project proposal", due: "Due in 6 days" },
];

export const ACTIVE_NOW = [
  { id: 1, name: "Daniel R." },
  { id: 2, name: "Priya S." },
  { id: 3, name: "Wei L." },
];

export const QUICK_LINKS = [
  { id: 1, label: "Syllabus", icon: "file", href: "https://example.com/syllabus" },
  { id: 2, label: "Zoom meeting link", icon: "video", href: "https://zoom.us" },
  { id: 3, label: "Textbook resources", icon: "link", href: "https://example.com/textbook" },
];


export const CLASSWORK_ITEMS = [
  { id: "cw-1", type: "quiz", title: "Quiz 1: Chapters 1–3", dueDate: "Due tomorrow, 11:59 PM", group: "This week", status: "due-soon", instructions: "Review chapters 1 through 3 before starting. You have one attempt and 30 minutes to complete the quiz.", attachments: [{ name: "Quiz study guide.pdf", detail: "PDF · 1.2 MB" }], submittedCount: 18, totalCount: 24 },
  { id: "cw-2", type: "assignment", title: "Homework set 4", dueDate: "Due in 3 days", group: "This week", status: "assigned", instructions: "Complete problems 1–24, showing your work for each equation.", attachments: [{ name: "Homework set 4.pdf", detail: "PDF · 820 KB" }], submittedCount: 11, totalCount: 24 },
  { id: "cw-3", type: "material", title: "Factoring video recap", dueDate: "Posted Sep 1", group: "Upcoming", status: "done", instructions: "Watch this short recap and use it alongside your notes when preparing for the quiz.", attachments: [{ name: "Factoring recap.mp4", detail: "Video · 8 min" }], submittedCount: 24, totalCount: 24 },
  { id: "cw-4", type: "assignment", title: "Linear functions practice", dueDate: "Due Aug 29", group: "Past", status: "missing", instructions: "Practice graphing and identifying the slope of linear functions.", attachments: [{ name: "Practice worksheet.pdf", detail: "PDF · 640 KB" }], submittedCount: 21, totalCount: 24 },
];

export const CLASS_MEMBERS = [
  { id: "t-1", name: "Ms. Patel", role: "teacher", avatar: "", online: true },
  { id: "s-1", name: "Daniel R.", role: "student", avatar: "", online: true },
  { id: "s-2", name: "Priya S.", role: "student", avatar: "", online: true },
  { id: "s-3", name: "Wei L.", role: "student", avatar: "", online: true },
  { id: "s-4", name: "Amelia K.", role: "student", avatar: "", online: false },
  { id: "s-5", name: "Jordan M.", role: "student", avatar: "", online: false },
  { id: "s-6", name: "Sofia A.", role: "student", avatar: "", online: false },
];

export const STUDENT_GRADES = [
  { id: "g-1", assignmentTitle: "Quiz 1: Chapters 1–3", dueDate: "Sep 8", score: null, outOf: 20, status: "due-soon" },
  { id: "g-2", assignmentTitle: "Homework set 4", dueDate: "Sep 10", score: null, outOf: 20, status: "assigned" },
  { id: "g-3", assignmentTitle: "Linear functions practice", dueDate: "Aug 29", score: 18, outOf: 20, status: "done" },
  { id: "g-4", assignmentTitle: "Factoring review", dueDate: "Aug 26", score: null, outOf: 15, status: "missing" },
];

export const TEACHER_GRADES = [
  { id: "s-1", studentName: "Daniel R.", avatar: "", average: "91%", missingCount: 0 },
  { id: "s-2", studentName: "Priya S.", avatar: "", average: "88%", missingCount: 0 },
  { id: "s-3", studentName: "Wei L.", avatar: "", average: "94%", missingCount: 0 },
  { id: "s-4", studentName: "Amelia K.", avatar: "", average: "—", missingCount: 1 },
];
