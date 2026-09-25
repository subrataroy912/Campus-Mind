import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfilePage from "./ProfilePage.jsx";

const mockUseDashboardData = vi.fn();
vi.mock("@/features/dashboard/hooks/useDashboardData.js", () => ({
  useDashboardData: () => mockUseDashboardData(),
}));

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "User One", canCreateCourses: true },
    authStatus: "authenticated",
  }),
}));

vi.mock("react-router", () => ({
  useParams: () => ({ userId: undefined }),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams(""), vi.fn()],
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../api/profileApi.js", () => ({
  useGetCurrentProfileQuery: () => ({
    data: {
      id: "user-1",
      displayName: "User One",
      profileVisibility: "PUBLIC",
    },
    isLoading: false,
    isError: false,
  }),
  useGetPublicProfileQuery: () => ({
    data: null,
    isLoading: false,
    isError: false,
  }),
  useUpdateCurrentProfileMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("ProfilePage compact spaces", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders compact spaces sub-tabs and compact space rows", () => {
    mockUseDashboardData.mockReturnValue({
      status: "ready",
      classrooms: [
        {
          id: "course-1",
          title: "Created Machine Learning",
          role: "OWNER",
          ownerId: "user-1",
          memberCount: 50,
        },
        {
          id: "course-2",
          title: "Joined Psychology 101",
          role: "MEMBER",
          ownerId: "prof-smith",
          memberCount: 120,
        },
      ],
    });

    const html = renderToString(<ProfilePage />);

    // Top-level tab
    expect(html).toContain("Spaces");

    // Sub-tabs for spaces
    expect(html).toContain("All");
    expect(html).toContain("Created by Me");
    expect(html).toContain("Joined");

    // Rendered spaces in compact format
    expect(html).toContain("Created Machine Learning");
    expect(html).toContain("Joined Psychology 101");
  });
});
