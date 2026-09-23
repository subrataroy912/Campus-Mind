import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import JoinSpace from "./JoinSpace.jsx";

let mockSearchParams = new URLSearchParams();

vi.mock("react-router", () => ({
  useSearchParams: () => [mockSearchParams],
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "u-1", name: "Student User" },
  }),
}));

vi.mock("../api/classroomApi.js", () => ({
  useValidateInviteTokenQuery: (token) => {
    if (token === "valid-token") {
      return {
        data: {
          courseId: "course-123",
          title: "Advanced Mathematics",
          ownerName: "Prof. Euler",
          memberCount: 42,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        isLoading: false,
        error: null,
      };
    }
    if (token === "expired-token") {
      return {
        data: { expired: true },
        isLoading: false,
        error: null,
      };
    }
    return { data: null, isLoading: false, error: null };
  },
}));

vi.mock("@/features/explore/api/exploreApi.js", () => ({
  useGetPublicCourseQuery: (courseId) => {
    if (courseId === "open-course") {
      return {
        data: {
          id: "open-course",
          title: "Introduction to Physics",
          subject: "Physics",
          instructorName: "Dr. Newton",
          accessType: "OPEN",
        },
      };
    }
    if (courseId === "invite-only") {
      return {
        data: {
          id: "invite-only",
          title: "Restricted Research Lab",
          accessType: "INVITE",
        },
      };
    }
    return { data: null };
  },
}));

describe("JoinSpace Refactored Page", () => {
  it("renders manual code entry screen by default", () => {
    mockSearchParams = new URLSearchParams();
    const html = renderToString(<JoinSpace />);

    expect(html).toContain("Join a space");
    expect(html).toContain("Space code");
    expect(html).toContain("Join space");
    expect(html).toContain("Back to spaces");
  });

  it("renders valid invitation card when invite token param is present", () => {
    mockSearchParams = new URLSearchParams({ invite: "valid-token" });
    const html = renderToString(<JoinSpace />);

    expect(html).toContain("Space Invitation");
    expect(html).toContain("Advanced Mathematics");
    expect(html).toContain("Prof. Euler");
    expect(html).toContain("members");
    expect(html).toContain("Join Space");
  });

  it("renders invalid invite screen when invite token is expired", () => {
    mockSearchParams = new URLSearchParams({ invite: "expired-token" });
    const html = renderToString(<JoinSpace />);

    expect(html).toContain("Invitation Expired or Invalid");
    expect(html).toContain("Back to spaces");
  });

  it("renders open course enrollment form when course has open access", () => {
    mockSearchParams = new URLSearchParams({
      courseId: "open-course",
      accessType: "OPEN",
    });
    const html = renderToString(<JoinSpace />);

    expect(html).toContain("Introduction to Physics");
    expect(html).toContain("Dr. Newton");
    expect(html).toContain("Join and Open Class");
  });

  it("renders invite-only message when space requires private invitation", () => {
    mockSearchParams = new URLSearchParams({
      courseId: "invite-only",
      accessType: "INVITE",
    });
    const html = renderToString(<JoinSpace />);

    expect(html).toContain("Invite-only space");
    expect(html).toContain("Restricted Research Lab");
    expect(html).toContain("This space is invite-only");
    expect(html).toContain("Back to dashboard");
  });
});
