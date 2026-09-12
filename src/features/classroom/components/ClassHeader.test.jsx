import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ClassHeader from "./ClassHeader.jsx";

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("ClassHeader privacy and role checks", () => {
  const sampleClass = {
    id: "course-123",
    title: "Advanced Data Structures",
    section: "CS 301",
    subject: "Computer Science",
    code: "SECRETBIGCODE",
    accessType: "code",
    teacher: { name: "Dr. Henderson" },
  };

  it("renders settings cog and class code when viewer is a teacher", () => {
    const html = renderToString(
      <ClassHeader
        classroom={sampleClass}
        isEnrolled={true}
        teacher={true}
      />
    );

    // Settings cog must be present
    expect(html).toContain("Class settings");
    // Raw class code must be present
    expect(html).toContain("Class code:");
    expect(html).toContain("SECRETBIGCODE");
  });

  it("hides settings cog and hides raw class code when viewer is a student/non-teacher", () => {
    const html = renderToString(
      <ClassHeader
        classroom={sampleClass}
        isEnrolled={true}
        teacher={false}
      />
    );

    // Settings cog must NOT be rendered
    expect(html).not.toContain("Class settings");
    expect(html).not.toContain("Edit class details");
    // Raw class code must NOT be leaked
    expect(html).not.toContain("SECRETBIGCODE");
    expect(html).not.toContain("Class code:");
    // Enrolled status indicator is rendered instead
    expect(html).toContain("Enrolled");
  });

  it("renders public join link for open access courses regardless of role", () => {
    const openClass = {
      ...sampleClass,
      accessType: "open",
    };

    const html = renderToString(
      <ClassHeader
        classroom={openClass}
        isEnrolled={true}
        teacher={false}
      />
    );

    expect(html).toContain("Copy join link");
    expect(html).not.toContain("Class settings");
  });
});
