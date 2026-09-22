export const MOCK_COMMUNITY_FILTERS = [
  { id: "all", label: "All Posts" },
  { id: "announcement", label: "Announcements" },
  { id: "question", label: "Questions" },
  { id: "discussion", label: "Discussions" },
];
export const MOCK_COMMUNITY_POSTS = [
  {
    id: "post-1",
    type: "announcement",
    pinned: true,
    classroom: "Campus Mind",
    time: "Just now",
    author: {
      name: "CampusMind Team",
      avatar: "/logo-square.webp",
    },
    content:
      "Welcome to the official CampusMind Community Hub! 🚀 We're thrilled to have you here. This space is designed for you to connect with fellow learners, share ideas, collaborate on projects, and build together. Drop a comment below to introduce yourself and say hello to the community!",
    likes: 124,
    comments: 42,
  },
];
