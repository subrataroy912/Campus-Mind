import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import SpaceListPage from "./SpaceListPage.jsx";

const mockUseDashboardData = vi.fn();
vi.mock("@/features/dashboard/hooks/useDashboardData.js", () => ({
  useDashboardData: () => mockUseDashboardData(),
}));

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "User One", canCreateCourses: true },
  }),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector) => selector({ baseApi: { queries: {} } }),
  useDispatch: () => vi.fn(),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useWindowVirtualizer: ({ count }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }).map((_, index) => ({
        index,
        size: 64,
        start: index * 64,
      })),
    getTotalSize: () => count * 64,
    options: { scrollMargin: 0 },
  }),
}));

describe("SpaceListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders segmented tabs with correct counts for created and joined spaces", () => {
    mockUseDashboardData.mockReturnValue({
      status: "success",
      classrooms: [
        {
          id: "c-1",
          title: "My Created Course",
          role: "OWNER",
          ownerId: "user-1",
          memberCount: 10,
        },
        {
          id: "c-2",
          title: "Joined Peer Group",
          role: "MEMBER",
          ownerId: "other-user",
          memberCount: 25,
        },
        {
          id: "c-3",
          title: "Joined Lab",
          role: "ADMIN",
          ownerId: "prof-user",
          memberCount: 5,
        },
      ],
    });

    const html = renderToString(<SpaceListPage />);

    // Header count
    expect(html).toContain("Spaces");
    // Tab labels
    expect(html).toContain("All");
    expect(html).toContain("Created by Me");
    expect(html).toContain("Joined");

    // Both spaces are rendered in default list view
    expect(html).toContain("My Created Course");
    expect(html).toContain("Joined Peer Group");
    expect(html).toContain("Joined Lab");
  });

  it("renders empty state when no spaces are joined or created", () => {
    mockUseDashboardData.mockReturnValue({
      status: "success",
      classrooms: [],
    });

    const html = renderToString(<SpaceListPage />);
    expect(html).toContain("You haven&#x27;t joined any spaces yet");
    expect(html).toContain("Join a space");
  });

  it("renders skeleton placeholder during loading status", () => {
    mockUseDashboardData.mockReturnValue({
      status: "loading",
      classrooms: [],
    });

    const html = renderToString(<SpaceListPage />);
    expect(html).toContain("Spaces");
    expect(html).toContain("space-list-skeleton-list");
  });
});
