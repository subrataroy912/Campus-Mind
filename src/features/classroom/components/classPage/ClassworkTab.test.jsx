import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ClassworkTab } from "./ClassworkTab.jsx";

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

vi.mock("../../api/courseworkApi.js", () => ({
  useGetCourseworkListQuery: vi.fn(({ courseId }) => {
    if (courseId === "empty-course") {
      return { data: { content: [] }, isLoading: false, error: null };
    }
    return {
      data: {
        content: [
          {
            id: "cw-1",
            title: "Problem Set 1",
            dueDate: "Tomorrow",
            status: "assigned",
            type: "ASSIGNMENT",
          },
        ],
      },
      isLoading: false,
      error: null,
    };
  }),
  useCreateCourseworkMutation: () => [vi.fn(), { isLoading: false }],
  useGetCourseworkByIdQuery: () => ({ data: null }),
  useGetSubmissionListQuery: () => ({ data: { content: [] } }),
  useGradeSubmissionMutation: () => [vi.fn()],
  useStartSubmissionMutation: () => [vi.fn()],
}));

vi.mock("../../api/commentApi.js", () => ({
  useGetCourseworkCommentsQuery: () => ({ data: [] }),
  useAddCourseworkCommentMutation: () => [vi.fn()],
  useAddSubmissionCommentMutation: () => [vi.fn()],
}));

vi.mock("../../api/attachmentApi.js", () => ({
  useRequestUploadUrlMutation: () => [vi.fn()],
  useCompleteUploadMutation: () => [vi.fn()],
}));

describe("ClassworkTab", () => {
  it("renders unenrolled gate when user is not enrolled", () => {
    const html = renderToString(
      <ClassworkTab
        classId="course-1"
        isEnrolled={false}
        teacher={false}
        onJoin={vi.fn()}
      />
    );
    expect(html).toContain("Classwork is reserved for enrolled students");
    expect(html).toContain("Join Class");
  });

  it("renders empty state when there is no coursework", () => {
    const html = renderToString(
      <ClassworkTab
        classId="empty-course"
        isEnrolled={true}
        teacher={false}
      />
    );
    expect(html).toContain("No classwork posted yet");
  });

  it("renders coursework cards when items are available", () => {
    const html = renderToString(
      <ClassworkTab
        classId="course-1"
        isEnrolled={true}
        teacher={false}
      />
    );
    expect(html).toContain("Problem Set 1");
    expect(html).toContain("Assigned");
  });

  it("renders create button when user is a teacher", () => {
    const html = renderToString(
      <ClassworkTab
        classId="course-1"
        isEnrolled={true}
        teacher={true}
      />
    );
    expect(html).toContain("Create");
  });
});
