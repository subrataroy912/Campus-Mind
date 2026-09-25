import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { store } from "@/app/store.js";
import { MembersTab } from "./MembersTab.jsx";

const renderWithStore = (ui) =>
  renderToString(<Provider store={store}>{ui}</Provider>);

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "Test User" },
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

vi.mock("../../api/classroomApi.js", () => ({
  useGetClassroomRosterQuery: vi.fn((classId) => {
    if (classId === "empty-course") {
      return { roster: [], isLoading: false };
    }
    if (classId === "large-roster") {
      const largeList = [{ id: "t-1", name: "Head Owner", role: "owner" }];
      for (let i = 1; i <= 55; i++) {
        largeList.push({ id: `s-${i}`, name: `Member ${i}`, role: "member" });
      }
      return { roster: largeList, isLoading: false };
    }
    return {
      roster: [
        { id: "u-1", name: "Alice Owner", role: "owner" },
        { id: "u-2", name: "Bob Member", role: "member" },
      ],
      isLoading: false,
    };
  }),
  useUpdateClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useRemoveCourseMemberMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateMemberRoleMutation: () => [vi.fn(), { isLoading: false }],
  useGetPendingJoinRequestsQuery: () => ({ pendingRequests: [], isLoading: false }),
  useApproveJoinRequestMutation: () => [vi.fn(), { isLoading: false }],
  useDeclineJoinRequestMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("MembersTab", () => {
  it("renders unenrolled gate when not enrolled", () => {
    const html = renderWithStore(
      <MembersTab
        classroom={{ id: "course-1" }}
        isEnrolled={false}
        isStaff={false}
        onJoin={vi.fn()}
      />
    );
    expect(html).toContain("Class roster is only available to members");
    expect(html).not.toContain("Join Space");
  });

  it("renders admins/owner and members correctly", () => {
    const html = renderWithStore(
      <MembersTab
        classroom={{ id: "course-1", memberCount: 2 }}
        isEnrolled={true}
        isStaff={false}
      />
    );
    expect(html).toContain("Admins &amp; Owner");
    expect(html).toContain("Alice Owner");
    expect(html).toContain("Members");
    expect(html).toContain("Bob Member");
  });

  it("renders invite code button for staff", () => {
    const html = renderWithStore(
      <MembersTab
        classroom={{
          id: "course-1",
          code: "ABC12345",
          enrollmentEnabled: true,
          memberCount: 2,
          role: "owner",
        }}
        isEnrolled={true}
        isStaff={true}
      />
    );
    expect(html).toContain("Code: ABC12345");
  });

  it("renders disabled code button when enrollment is disabled", () => {
    const html = renderWithStore(
      <MembersTab
        classroom={{
          id: "course-1",
          code: "ABC12345",
          enrollmentEnabled: false,
          memberCount: 2,
          role: "owner",
        }}
        isEnrolled={true}
        isStaff={true}
      />
    );
    expect(html).toContain("Code disabled");
  });

  it("renders manage trigger button for members when viewer is owner", () => {
    const html = renderWithStore(
      <MembersTab
        classroom={{
          id: "course-1",
          memberCount: 2,
          role: "owner",
          ownerId: "user-1",
        }}
        isEnrolled={true}
        isStaff={true}
      />
    );
    expect(html).toContain("Manage Bob Member");
  });
});
