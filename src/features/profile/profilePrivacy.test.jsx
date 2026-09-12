import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfilePage from "./pages/ProfilePage.jsx";

// Mock react-router
vi.mock("react-router", () => ({
  useParams: () => ({ userId: "target-user-456" }),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams(""), vi.fn()],
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock AuthContext
vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "viewer-123", email: "viewer@example.com" },
    updateProfile: vi.fn(),
    unlockCreator: vi.fn(),
    authStatus: "authenticated",
  }),
}));

// Mock dashboard data
vi.mock("@/features/dashboard/useDashboardData.js", () => ({
  useDashboardData: () => ({
    classrooms: [],
    exploreClassrooms: [],
    status: "ready",
  }),
}));

// Mock profile API queries
vi.mock("./api/profileApi.js", () => ({
  useGetCurrentProfileQuery: () => ({
    data: null,
    isLoading: false,
    isError: false,
  }),
  useGetPublicProfileQuery: () => ({
    data: {
      id: "target-user-456",
      displayName: "Secret User",
      profileVisibility: "PRIVATE",
      phone: "+1 555-0199",
      address: "123 Classified St",
      gender: "FEMALE",
      dateOfBirth: "2000-01-01",
    },
    isLoading: false,
    isError: false,
  }),
  useUpdateCurrentProfileMutation: () => [vi.fn(), { isLoading: false }],
  useUnlockCreatorMutation: () => [vi.fn(), { isLoading: false }],
}));

// Mock sharedClasses utility to simulate 0 shared classes
vi.mock("@/utils/sharedClasses.js", () => ({
  getSharedClassCount: () => 0,
  getSharedClassIds: () => [],
}));

describe("ProfilePage privacy access control", () => {
  it("renders 'This profile is private' and completely blocks contact/sensitive details for unauthorized viewers", () => {
    const html = renderToString(<ProfilePage />);

    // Private profile placeholder must be rendered
    expect(html).toContain("This profile is private");
    expect(html).toContain(
      "This member is only visible to people in a shared class."
    );

    // Sensitive contact details must NOT be rendered
    expect(html).not.toContain("+1 555-0199");
    expect(html).not.toContain("123 Classified St");
    expect(html).not.toContain("2000-01-01");
    expect(html).not.toContain("Personal &amp; Account Information");
  });
});
