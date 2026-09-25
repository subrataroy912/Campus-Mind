import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import SpaceFeedPost from "./SpaceFeedPost.jsx";

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../api/commentApi.js", () => ({
  useGetCourseworkCommentsQuery: () => ({ data: [], isLoading: false }),
  useAddCourseworkCommentMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("SpaceFeedPost", () => {
  it("renders author name and avatar from creator fields rather than space owner", () => {
    const post = {
      id: "cw-1",
      creatorName: "Jane Doe",
      creatorAvatarUrl: "https://example.com/jane.jpg",
      creatorHandle: "janedoe",
      creatorId: "user-456",
      title: "Project Milestone 1",
      description: "Please check your milestone deliverables.",
      type: "ANNOUNCEMENT",
    };

    const html = renderToString(
      <SpaceFeedPost post={post} currentUser={{ id: "user-123" }} />,
    );

    expect(html).toContain("Jane Doe");
    expect(html).toContain("@janedoe");
    expect(html).toContain("https://example.com/jane.jpg");
    expect(html).not.toContain("Subrata Roy");
    expect(html).toContain("Please check your milestone deliverables.");
  });

  it("renders pinned badge when post is pinned", () => {
    const post = {
      id: "cw-2",
      creatorName: "Prof. Alan",
      description: "Exam schedule announced.",
      pinned: true,
    };

    const html = renderToString(<SpaceFeedPost post={post} />);

    expect(html).toContain("Pinned announcement");
  });

  it("renders attachments such as images and video links", () => {
    const post = {
      id: "cw-3",
      creatorName: "Alice",
      description: "Here are the lecture slides and recording.",
      attachments: [
        {
          type: "IMAGE",
          title: "Architecture Diagram",
          url: "https://example.com/diagram.png",
        },
        {
          type: "VIDEO",
          title: "Lecture Recording",
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          type: "FILE",
          title: "LectureNotes.pdf",
          url: "https://example.com/notes.pdf",
        },
      ],
    };

    const html = renderToString(<SpaceFeedPost post={post} />);

    expect(html).toContain("Architecture Diagram");
    expect(html).toContain("https://example.com/diagram.png");
    expect(html).toContain("LectureNotes.pdf");
    expect(html).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("shows post menu button for staff and authors", () => {
    const post = {
      id: "cw-4",
      creatorId: "author-1",
      creatorName: "Author",
      description: "My post.",
    };

    // Staff viewing
    const htmlStaff = renderToString(
      <SpaceFeedPost
        post={post}
        isStaff={true}
        currentUser={{ id: "staff-99" }}
      />,
    );
    expect(htmlStaff).toContain('title="More actions"');

    // Author viewing
    const htmlAuthor = renderToString(
      <SpaceFeedPost
        post={post}
        isStaff={false}
        currentUser={{ id: "author-1" }}
      />,
    );
    expect(htmlAuthor).toContain('title="More actions"');

    // Random non-staff member viewing
    const htmlRandom = renderToString(
      <SpaceFeedPost
        post={post}
        isStaff={false}
        currentUser={{ id: "stranger-99" }}
      />,
    );
    expect(htmlRandom).not.toContain('title="More actions"');
  });
});
