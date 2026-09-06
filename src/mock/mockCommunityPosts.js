export const COMMUNITY_POSTS = [
  {
    id: "post-1",
    type: "question",
    author: {
      id: "13719353",
      name: "Debraj Roy",
      avatar: "https://testingbot.com/free-online-tools/random-avatar/300",
    },
    avatarColor: "bg-primary",
    classroom: "Algebra II",
    time: "2 hours ago",
    content:
      "Can someone explain problem 14 from last night's homework? I keep getting a negative answer for the discriminant.",
    likes: 6,
    comments: 9,
    pinned: false,
  },
  {
    id: "post-2",
    type: "announcement",
    author: {
      id: "1371984",
      name: "subrata roy",
      avatar: "https://testingbot.com/free-online-tools/random-avatar/400",
    },
    avatarColor: "bg-secondary",
    classroom: "Algebra II",
    time: "5 hours ago",
    content:
      "Reminder: Quiz 1 covers chapters 1–3. The practice set is posted under Classwork — work through it before Friday.",
    likes: 21,
    comments: 3,
    pinned: true,
  },
  {
    id: "post-3",
    type: "discussion",
    author: {
      id: "1335431984",
      name: "Nabojeet Biswas",
      avatar: "https://testingbot.com/free-online-tools/random-avatar/500",
    },
    avatarColor: "bg-accent",
    classroom: "World History",
    time: "Yesterday",
    content:
      "Starting a study group for the unit 3 exam — we're meeting in the library Thursday at 4pm. Anyone want to join?",
    likes: 14,
    comments: 12,
    pinned: false,
  },
  {
    id: "post-4",
    type: "announcement",
    author: {
      id: "137924284",
      name: "Riya Saren",
      avatar: "https://testingbot.com/free-online-tools/random-avatar/600",
    },
    avatarColor: "bg-secondary",
    classroom: "World History",
    time: "2 days ago",
    content:
      "Great questions in class today about the causes of the revolution — here's a short recap video for anyone who wants a refresher.",
    likes: 18,
    comments: 2,
    pinned: false,
  },
  {
    id: "post-5",
    type: "question",
    author: {
      id: "141487294",
      name: "dhrubo biswas",
      avatar: "https://testingbot.com/free-online-tools/random-avatar/700",
    },
    avatarColor: "bg-primary",
    classroom: "AP Physics",
    time: "3 days ago",
    content:
      "Is the lab report due before or after the makeup session? The syllabus and the pinned post don't agree.",
    likes: 4,
    comments: 7,
    pinned: false,
  },
];

export const COMMUNITY_FILTERS = [
  { id: "all", label: "All classes" },
  { id: "announcement", label: "Announcements" },
  { id: "question", label: "Questions" },
  { id: "discussion", label: "Discussions" },
];
