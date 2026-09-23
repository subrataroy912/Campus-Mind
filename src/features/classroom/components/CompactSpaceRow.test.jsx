import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import CompactSpaceRow from "./CompactSpaceRow.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-123", name: "Current User" },
  }),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("CompactSpaceRow", () => {
  const sampleClass = {
    id: "course-1",
    title: "Algorithms & Data Structures",
    subject: "computer-science",
    memberCount: 42,
    unreadCount: 3,
    role: "MEMBER",
    ownerId: "user-999",
  };

  it("renders space title, formatted subject, and member count", () => {
    const html = renderToString(<CompactSpaceRow classroom={sampleClass} />);
    expect(html).toContain("Algorithms &amp; Data Structures");
    expect(html).toContain("Computer Science");
    expect(html).toContain("42");
    expect(html).toMatch(/3<!-- -->\s*new|3 new/);
    expect(html).toContain("Member");
  });

  it("renders Owner badge when role is OWNER or ownerId matches current user", () => {
    const ownedClass = {
      ...sampleClass,
      ownerId: "user-123",
      role: "OWNER",
    };
    const html = renderToString(<CompactSpaceRow classroom={ownedClass} />);
    expect(html).toContain("Owner");
    expect(html).not.toContain("Member");
  });

  it("renders Admin badge when user is admin", () => {
    const adminClass = {
      ...sampleClass,
      role: "ADMIN",
    };
    const html = renderToString(<CompactSpaceRow classroom={adminClass} />);
    expect(html).toContain("Admin");
  });
});
