import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { store } from "@/app/store.js";
import SpaceHeader from "./SpaceHeader.jsx";

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock("../api/classroomApi.js", () => ({
  useArchiveClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useLeaveClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateClassroomMutation: () => [vi.fn(), { isLoading: false }],
  useCancelJoinRequestMutation: () => [vi.fn(), { isLoading: false }],
  useGenerateInviteLinkMutation: () => [vi.fn(), { isLoading: false }],
}));

const renderWithStore = (ui) =>
  renderToString(<Provider store={store}>{ui}</Provider>);

describe("SpaceHeader privacy and role checks", () => {
  const sampleClass = {
    id: "course-123",
    title: "Advanced Data Structures",
    section: "CS 301",
    subject: "Computer Science",
    code: "SECRETBIGCODE",
    accessType: "LINK_ONLY",
    owner: { name: "Dr. Henderson" },
  };

  it("renders settings cog and invite link when viewer is staff on LINK_ONLY space", () => {
    const html = renderWithStore(
      <SpaceHeader
        classroom={sampleClass}
        isEnrolled={true}
        isStaff={true}
      />
    );

    // Settings cog must be present
    expect(html).toContain("Class settings");
    // Staff gets Invite Link button for LINK_ONLY space
    expect(html).toContain("Invite Link");
  });

  it("hides settings cog and hides invite link when viewer is a member/non-staff", () => {
    const html = renderWithStore(
      <SpaceHeader
        classroom={sampleClass}
        isEnrolled={true}
        isStaff={false}
      />
    );

    // Settings cog must NOT be rendered
    expect(html).not.toContain("Class settings");
    expect(html).not.toContain("Edit space &amp; branding");
    // Invite link must NOT be visible to regular members on LINK_ONLY space
    expect(html).not.toContain("Invite Link");
    // Enrolled status indicator is rendered instead
    expect(html).toContain("Enrolled");
  });

  it("renders public copy space link for PUBLIC access spaces", () => {
    const openClass = {
      ...sampleClass,
      accessType: "PUBLIC",
    };

    const html = renderWithStore(
      <SpaceHeader
        classroom={openClass}
        isEnrolled={true}
        isStaff={false}
      />
    );

    expect(html).toContain("Copy link");
    expect(html).not.toContain("Class settings");
  });
});
