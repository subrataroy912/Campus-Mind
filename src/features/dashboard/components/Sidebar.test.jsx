import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import Sidebar from "./Sidebar.jsx";

let mockUser = { id: "u1", canCreateCourses: false };

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  NavLink: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("Sidebar navigation and creator gating", () => {
  it("hides 'Create a class' button when user does not have course creator privileges", () => {
    mockUser = { id: "u1", canCreateCourses: false };
    const html = renderToString(<Sidebar />);
    expect(html).not.toContain("Create a class");
    expect(html).not.toContain("/dashboard/class/create");
    expect(html).toContain("Join with code");
  });

  it("renders 'Create a class' button when user has course creator privileges", () => {
    mockUser = { id: "u1", canCreateCourses: true };
    const html = renderToString(<Sidebar />);
    expect(html).toContain("Create a class");
    expect(html).toContain("/dashboard/class/create");
    expect(html).toContain("Join with code");
  });
});
