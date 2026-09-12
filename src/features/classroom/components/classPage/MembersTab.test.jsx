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
      const largeList = [{ id: "t-1", name: "Head Teacher", role: "teacher" }];
      for (let i = 1; i <= 55; i++) {
        largeList.push({ id: `s-${i}`, name: `Student ${i}`, role: "student" });
      }
      return { data: largeList, isLoading: false };
    }
    return {
      data: [
        { id: "u-1", name: "Alice Teacher", role: "teacher" },
        { id: "u-2", name: "Bob Student", role: "student" },
      ],
      isLoading: false,
    };
  }),
  useUpdateClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useRemoveCourseMemberMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("MembersTab", () => {
  it("renders unenrolled gate when not enrolled", () => {
    const html = renderToString(
      <MembersTab
        classroom={{ id: "course-1" }}
        isEnrolled={false}
        teacher={false}
        onJoin={vi.fn()}
      />
    );
    expect(html).toContain("Class roster is only available to members");
    expect(html).toContain("Join Class");
  });

  it("renders instructors and students correctly", () => {
    const html = renderToString(
      <MembersTab
        classroom={{ id: "course-1", memberCount: 2 }}
        isEnrolled={true}
        teacher={false}
      />
    );
    expect(html).toContain("Instructors &amp; Teachers");
    expect(html).toContain("Alice Teacher");
    expect(html).toContain("Students");
    expect(html).toContain("Bob Student");
  });

  it("renders invite code button for teacher", () => {
    const html = renderToString(
      <MembersTab
        classroom={{
          id: "course-1",
          code: "ABC12345",
          enrollmentEnabled: true,
          memberCount: 2,
        }}
        isEnrolled={true}
        teacher={true}
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
        }}
        isEnrolled={true}
        teacher={true}
      />
    );
    expect(html).toContain("Code disabled");
  });

  it("applies windowing and renders expand button when student count exceeds 50", () => {
    const html = renderToString(
      <MembersTab
        classroom={{
          id: "large-roster",
          memberCount: 56,
        }}
        isEnrolled={true}
        teacher={false}
      />
    );
    expect(html).toContain("Students (");
    expect(html).toContain("55");
    expect(html).toContain("Show all 55 students");
    expect(html).toContain("Student 50");
    // Beyond 50 should be windowed out initially
    expect(html).not.toContain("Student 51");
  });
});
