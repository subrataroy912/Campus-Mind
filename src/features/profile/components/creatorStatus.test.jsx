import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileHeader from "./ProfileHeader.jsx";
import { formatDisplayText } from "@/utils/textFormat.js";

// Mock react-router
vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock AuthContext
vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    unlockCreator: vi.fn(),
  }),
}));

// Mock dropdown menu to render content in tests
vi.mock("@/components/ui/dropdown-menu.jsx", () => ({
  DropdownMenu: ({ children }) => <div data-slot="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ render, children }) => render || children,
  DropdownMenuContent: ({ children }) => <div data-slot="dropdown-menu-content">{children}</div>,
  DropdownMenuItem: ({ children, render, onClick }) =>
    render ? render : <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
}));

// Mock dialog to render content in tests
vi.mock("@/components/ui/dialog.jsx", () => ({
  Dialog: ({ children, open }) => <div data-slot="dialog" data-open={open}>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <p>{children}</p>,
}));

describe("Format display text rules", () => {
  it("formats course membership roles correctly", () => {
    expect(formatDisplayText("STUDENT")).toBe("Student");
    expect(formatDisplayText("TEACHER")).toBe("Teacher");
  });
});

describe("ProfileHeader creator badge and role display", () => {
  it("renders standalone Course Creator badge when user has creator privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: true,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={false} />);

    expect(html).toContain('data-slot="creator-badge"');
    expect(html).toContain("Course Creator");
    expect(html).not.toContain("Student");
    expect(html).not.toContain("Teacher");
  });

  it("does not render role pill or creator badge when user has standard privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={false} />);

    expect(html).not.toContain('data-slot="creator-badge"');
    expect(html).not.toContain("Student");
    expect(html).not.toContain("Teacher");
  });
});

describe("ProfileHeader creator action and confirmation", () => {
  it("renders 'Become a Creator' option when user is the profile owner and does not have creator privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={true} />);

    expect(html).toContain("Become a Creator");
    expect(html).toContain("Unlocks course and group creation. Permanent change.");
  });

  it("does not render 'Become a Creator' option when user is not the profile owner", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={false} />);

    expect(html).not.toContain("Become a Creator");
  });

  it("does not render 'Become a Creator' option when owner already has creator privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: true,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={true} />);

    expect(html).not.toContain("Become a Creator");
  });

  it("renders confirmation dialog with irreversible action warning copy in ProfileHeader", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={true} />);

    expect(html).toContain("Become a Course Creator");
    expect(html).toContain("Unlock course-creation privileges to build classes and host learning groups. This is a permanent change and cannot be undone.");
    expect(html).toContain("Yes, Become Creator");
  });
});
