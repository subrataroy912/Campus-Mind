import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ClassHomeTab } from "./ClassHomeTab.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "Current User", username: "currentuser" },
    authStatus: "authenticated",
  }),
}));

vi.mock("react-router", () => ({
  useParams: () => ({ classId: "course-1" }),
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ui/toast.jsx", () => ({
  toast: {
    add: vi.fn(),
  },
}));

vi.mock("../../api/courseworkApi.js", () => ({
  useGetCourseworkListQuery: vi.fn(({ courseId }) => {
    if (courseId === "empty-course") {
      return { data: { content: [] }, isLoading: false, isError: false, refetch: vi.fn() };
    }
    return {
      data: {
        content: [
          {
            id: "cw-1",
            title: "Welcome to Space",
            description: "First announcement message for everyone.",
            createdAt: "2026-09-10T10:00:00Z",
            type: "ANNOUNCEMENT",
            author: { id: "teacher-1", name: "Dr. Smith" },
          },
          {
            id: "cw-2",
            title: "Discussion Topic",
            description: "Please discuss this week's reading.",
            createdAt: "2026-09-12T10:00:00Z",
            type: "DISCUSSION",
            author: { id: "user-1", name: "Current User" },
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    };
  }),
  useCreateCourseworkMutation: () => [vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve({}) }), { isLoading: false }],
  useDeleteCourseworkMutation: () => [vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve({}) }), { isLoading: false }],
}));

vi.mock("../../api/commentApi.js", () => ({
  useGetCourseworkCommentsQuery: () => ({
    data: [
      { id: "cm-1", content: "Great update!", author: { name: "Student A" }, createdAt: "2026-09-12T11:00:00Z" }
    ],
    isLoading: false,
  }),
  useAddCourseworkCommentMutation: () => [vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve({}) }), { isLoading: false }],
}));

describe("ClassHomeTab", () => {
  const sampleClassroom = {
    id: "course-1",
    title: "CS 101: Introduction to Algorithms",
    subject: "Computer Science",
    description: "Welcome to Algorithms. We meet every Tuesday and Thursday.",
    spaceType: "ACADEMIC_CLASS",
    teacher: { id: "teacher-1", name: "Dr. Smith" },
    memberCount: 42,
    visibility: "PUBLIC",
    accessType: "open",
  };

  it("renders space preview banner when user is not enrolled", () => {
    const html = renderToString(
      <ClassHomeTab
        classroom={sampleClassroom}
        isEnrolled={false}
        onJoin={vi.fn()}
      />
    );
    expect(html).toContain("You are previewing this space");
    expect(html).toContain("Join Space");
  });

  it("renders space metadata and facilitator information", () => {
    const html = renderToString(
      <ClassHomeTab
        classroom={sampleClassroom}
        isEnrolled={true}
      />
    );
    expect(html).toContain("About this space");
    expect(html).toContain("Dr. Smith");
    expect(html).toContain("Computer Science");
    expect(html).toContain("42 members");
  });

  it("renders empty state when there are no announcements or updates", () => {
    const html = renderToString(
      <ClassHomeTab
        classroom={{ ...sampleClassroom, id: "empty-course" }}
        isEnrolled={true}
      />
    );
    expect(html).toContain("No updates posted yet");
  });

  it("renders post creation box for enrolled users", () => {
    const html = renderToString(
      <ClassHomeTab
        classroom={sampleClassroom}
        isEnrolled={true}
      />
    );
    expect(html).toContain("Share an announcement, topic, or update with the space");
    expect(html).toContain("Publish");
  });

  it("renders feed posts in stream", () => {
    const html = renderToString(
      <ClassHomeTab
        classroom={sampleClassroom}
        isEnrolled={true}
      />
    );
    expect(html).toContain("Welcome to Space");
    expect(html).toContain("First announcement message for everyone.");
    expect(html).toContain("Discussion Topic");
    expect(html).toContain("Please discuss this week&#x27;s reading.");
  });
});
