import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MembersTab } from "./MembersTab.jsx";

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

vi.mock("../../api/classroomApi.js", () => ({
  useGetClassroomRosterQuery: vi.fn((classId) => {
    if (classId === "empty-course") {
      return { data: [], isLoading: false };
    }
    if (classId === "large-roster") {
      const largeList = [{ id: "t-1", name: "Head Owner", role: "owner" }];
      for (let i = 1; i <= 55; i++) {
        largeList.push({ id: `s-${i}`, name: `Member ${i}`, role: "member" });
      }
      return { data: largeList, isLoading: false };
    }
    return {
      data: [
        { id: "u-1", name: "Alice Owner", role: "owner" },
        { id: "u-2", name: "Bob Member", role: "member" },
      ],
      isLoading: false,
    };
  }),
  useUpdateClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useRemoveCourseMemberMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateMemberRoleMutation: () => [vi.fn(), { isLoading: false }],
  useGetPendingJoinRequestsQuery: () => ({ data: [], isLoading: false }),
  useApproveJoinRequestMutation: () => [vi.fn(), { isLoading: false }],
  useDeclineJoinRequestMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("MembersTab", () => {
  it("renders unenrolled gate when not enrolled", () => {
    const html = renderToString(
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
    const html = renderToString(
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
    const html = renderToString(
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
    const html = renderToString(
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

  it("applies windowing and renders expand button when member count exceeds 50", () => {
    const html = renderToString(
      <MembersTab
        classroom={{
          id: "large-roster",
          memberCount: 56,
        }}
        isEnrolled={true}
        isStaff={false}
      />
    );
    expect(html).toContain("Members (");
    expect(html).toContain("55");
    expect(html).toContain("Show all 55 members");
    expect(html).toContain("Member 50");
    // Beyond 50 should be windowed out initially
    expect(html).not.toContain("Member 51");
  });
});
