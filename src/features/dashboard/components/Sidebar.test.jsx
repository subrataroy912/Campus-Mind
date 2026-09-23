import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import Sidebar from "./Sidebar.jsx";

import { routes } from "@/routes/paths.js";

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
  NavLink: ({ children, to, end: _end, className, ...props }) => {
    const resolvedClass =
      typeof className === "function"
        ? className({ isActive: false, isPending: false })
        : className;
    return (
      <a href={to} className={resolvedClass} {...props}>
        {children}
      </a>
    );
  },
}));

describe("Sidebar navigation and creator gating", () => {
  it("hides 'Create a space' button when user does not have course creator privileges", () => {
    mockUser = { id: "u1", canCreateCourses: false };
    const html = renderToString(<Sidebar />);
    expect(html).not.toContain("Create a space");
    expect(html).not.toContain(routes.spaces.new);
    expect(html).toContain("Join with code");
  });

  it("renders 'Create a space' button when user has course creator privileges", () => {
    mockUser = { id: "u1", canCreateCourses: true };
    const html = renderToString(<Sidebar />);
    expect(html).toContain("Create a space");
    expect(html).toContain(routes.spaces.new);
    expect(html).toContain("Join with code");
  });

  it("renders 'Create a space' button when user is an admin", () => {
    mockUser = { id: "u1", canCreateCourses: false, isAdmin: true };
    const html = renderToString(<Sidebar />);
    expect(html).toContain("Create a space");
    expect(html).toContain(routes.spaces.new);
    expect(html).toContain("Join with code");
  });
});
