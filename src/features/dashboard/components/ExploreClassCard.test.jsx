import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ExploreClassCard from "./ExploreClassCard.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({ user: { id: "user-1", name: "Test User" } }),
}));

vi.mock("@/features/dashboard/useDashboardData.js", () => ({
  useDashboardData: () => ({ classrooms: [{ id: "enrolled-1" }] }),
}));

describe("ExploreClassCard", () => {
  it("renders card title, subject, public badge, and formatted learner count", () => {
    const classroom = {
      id: "course-public-1",
      title: "Introduction to Biology",
      subject: "Science",
      accessType: "OPEN",
      memberCount: 1420,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExploreClassCard classroom={classroom} />
      </MemoryRouter>
    );

    expect(html).toContain("Introduction to Biology");
    expect(html).toContain("Science");
    expect(html).toContain("Public");
    expect(html).toContain("1.4k learners");
    expect(html).toContain("Open");
  });

  it("renders code badge and handles zero learners correctly", () => {
    const classroom = {
      courseId: "course-code-2",
      title: "Advanced Chemistry",
      accessType: "CODE",
      enrollmentCount: 0,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExploreClassCard classroom={classroom} />
      </MemoryRouter>
    );

    expect(html).toContain("Advanced Chemistry");
    expect(html).toContain("Code");
    expect(html).toContain("0 learners");
  });

  it("renders invite-only badge and custom initials", () => {
    const classroom = {
      courseId: "course-invite-3",
      title: "Machine Learning Workshop",
      accessType: "INVITE",
      memberCount: 1,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExploreClassCard classroom={classroom} />
      </MemoryRouter>
    );

    expect(html).toContain("Invite only");
    expect(html).toContain("1 learner");
    expect(html).toContain("ML");
  });
});
