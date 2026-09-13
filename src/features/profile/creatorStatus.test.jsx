import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileDetails from "./components/ProfileDetails.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
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

describe("Student creator status and display rules", () => {
  it("never outputs 'STUDENT_CREATOR' string when formatting account types", () => {
    expect(formatDisplayText("STUDENT")).toBe("Student");
    expect(formatDisplayText("STUDENT_CREATOR")).toBe("Student");
    expect(formatDisplayText("STUDENT_CREATOR")).not.toContain("CREATOR");
  });

  it("renders 'Student' with a subtle creator indicator mark when student is upgraded", () => {
    const details = [
      {
        label: "Account type",
        value: "STUDENT",
        icon: "member",
        isCreator: true,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Student");
    expect(html).toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
    expect(html).not.toContain("Student Creator");
  });

  it("renders 'Student' without creator indicator mark when student has standard privileges", () => {
    const details = [
      {
        label: "Account type",
        value: "STUDENT",
        icon: "member",
        isCreator: false,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Student");
    expect(html).not.toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
  });

  it("renders 'Teacher' without creator indicator mark because teachers already have full privileges", () => {
    const details = [
      {
        label: "Account type",
        value: "TEACHER",
        icon: "member",
        isCreator: false,
      },
    ];

    const html = renderToString(<ProfileDetails details={details} />);

    expect(html).toContain("Teacher");
    expect(html).not.toContain("Course Creator");
    expect(html).not.toContain("STUDENT_CREATOR");
  });
});

describe("ProfileHeader creator action and confirmation", () => {
  it("renders 'Become a Creator' option when user is the profile owner and does not have creator privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      accountType: "STUDENT",
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
      accountType: "STUDENT",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={false} />);

    expect(html).not.toContain("Become a Creator");
  });

  it("does not render 'Become a Creator' option when owner already has creator privileges", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      accountType: "STUDENT",
      canCreateCourses: true,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={true} />);

    expect(html).not.toContain("Become a Creator");
  });

  it("renders confirmation dialog with irreversible action warning copy in ProfileHeader", () => {
    const profile = {
      id: "u1",
      name: "Jane Doe",
      accountType: "STUDENT",
      canCreateCourses: false,
    };

    const html = renderToString(<ProfileHeader profile={profile} isOwner={true} />);

    expect(html).toContain("Become a Course Creator");
    expect(html).toContain("Unlock course-creation privileges to build classes and host learning groups. This is a permanent change and cannot be undone.");
    expect(html).toContain("Yes, Become Creator");
  });
});
