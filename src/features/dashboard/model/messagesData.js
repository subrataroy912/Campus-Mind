export const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    name: "Campus Mind",
    avatar: "/logo-square.webp",
    classroom: "Campus Onboarding",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    lastMessage: "",
    unread: 1,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Welcome to Campus Mind! 🚀 We're thrilled to have you here.",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      },
    ],
  },
];
