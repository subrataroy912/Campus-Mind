import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { GradesTab } from "./GradesTab.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "student-1", name: "Student One" },
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

vi.mock("../../api/courseworkApi.js", () => ({
  useGetStudentGradebookQuery: vi.fn(() => ({
    data: [
      {
        id: "sub-1",
        assignmentTitle: "Quiz 1",
        dueDate: "2026-03-10",
        score: 95,
        outOf: 100,
        status: "graded",
      },
      {
        id: "sub-2",
        assignmentTitle: "Homework 2",
        dueDate: "2026-03-15",
        score: null,
        outOf: 100,
        status: "missing",
      },
    ],
  })),
  useGetTeacherGradebookQuery: vi.fn(() => ({
    data: [
      {
        id: "student-1",
        studentName: "Student One",
        average: "95%",
        missingCount: 1,
        submittedCount: 1,
      },
    ],
  })),
  useGetCourseAnalyticsSummaryQuery: vi.fn(() => ({
    data: {
      averageScore: 92.5,
      missingCount: 3,
      submissionCount: 14,
    },
  })),
}));

describe("GradesTab", () => {
  it("renders unenrolled gate when not enrolled", () => {
    const html = renderToString(
      <GradesTab isEnrolled={false} teacher={false} onJoin={vi.fn()} />
    );
    expect(html).toContain("Gradebook is reserved for enrolled students");
    expect(html).toContain("Join Class");
  });

  it("renders student grades and summary metrics", () => {
    const html = renderToString(
      <GradesTab isEnrolled={true} teacher={false} />
    );
    expect(html).toContain("Your grade");
    expect(html).toContain("Assignments graded");
    expect(html).toContain("Quiz 1");
    expect(html).toContain("95/100");
    expect(html).toContain("Graded");
    expect(html).toContain("Homework 2");
    expect(html).toContain("Missing");
  });

  it("renders teacher gradebook view and class metrics", () => {
    const html = renderToString(
      <GradesTab isEnrolled={true} teacher={true} />
    );
    expect(html).toContain("Class average");
    expect(html).toContain("93%");
    expect(html).toContain("Submissions received");
    expect(html).toContain("Student One");
    expect(html).toContain("95%");
    expect(html).toContain("View breakdown");
  });
});
