import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { store } from "@/app/store.js";
import { ClassworkTab } from "./ClassworkTab.jsx";

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
  useBlocker: () => ({ state: "unblocked", reset: vi.fn(), proceed: vi.fn() }),
  useBeforeUnload: vi.fn(),
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
  useUpdateCourseworkMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteCourseworkMutation: () => [vi.fn(), { isLoading: false }],
  useGetMySubmissionQuery: () => ({ data: null }),
  useSaveSubmissionMutation: () => [vi.fn(), { isLoading: false }],
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
    const html = renderWithStore(
      <ClassworkTab
        classId="course-1"
        isEnrolled={false}
        isStaff={false}
        onJoin={vi.fn()}
      />
    );
    expect(html).toContain("Classwork is reserved for enrolled members");
    expect(html).not.toContain("Join Space");
  });

  it("renders empty state when there is no coursework", () => {
    const html = renderWithStore(
      <ClassworkTab
        classId="empty-course"
        isEnrolled={true}
        isStaff={false}
      />
    );
    expect(html).toContain("No classwork posted yet");
  });

  it("renders coursework cards when items are available", () => {
    const html = renderWithStore(
      <ClassworkTab
        classId="course-1"
        isEnrolled={true}
        isStaff={false}
      />
    );
    expect(html).toContain("Problem Set 1");
    expect(html).toContain("Assigned");
  });

  it("renders create button when user is staff", () => {
    const html = renderWithStore(
      <ClassworkTab
        classId="course-1"
        isEnrolled={true}
        isStaff={true}
      />
    );
    expect(html).toContain("Create");
  });
});
