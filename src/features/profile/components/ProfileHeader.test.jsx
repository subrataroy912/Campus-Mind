import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileHeader from "./ProfileHeader.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    unlockCreator: vi.fn(),
  }),
}));

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("ProfileHeader media controls", () => {
  const profileWithMedia = {
    id: "user-1",
    name: "Alex Doe",
    handle: "alexdoe",
    avatar: "https://example.com/avatar.jpg",
    banner: "https://example.com/banner.jpg",
    headline: "Full Stack Engineer",
    bio: "Passionate about learning.",
    links: [],
    canCreateCourses: true,
  };

  it("renders delete buttons for avatar and banner when owner has media", () => {
    const handleAvatarDelete = vi.fn();
    const handleBannerDelete = vi.fn();

    const html = renderToString(
      <ProfileHeader
        profile={profileWithMedia}
        isOwner={true}
        onAvatarUpload={vi.fn()}
        onAvatarDelete={handleAvatarDelete}
        onBannerUpload={vi.fn()}
        onBannerDelete={handleBannerDelete}
      />
    );

    expect(html).toContain("Remove avatar picture");
    expect(html).toContain("Remove banner cover");
    expect(html).toContain("Change avatar");
    expect(html).toContain("Change profile banner");
  });

  it("does not render delete buttons for viewers", () => {
    const html = renderToString(
      <ProfileHeader
        profile={profileWithMedia}
        isOwner={false}
        onAvatarUpload={vi.fn()}
        onAvatarDelete={vi.fn()}
        onBannerUpload={vi.fn()}
        onBannerDelete={vi.fn()}
      />
    );

    expect(html).not.toContain("Remove avatar picture");
    expect(html).not.toContain("Remove banner cover");
    expect(html).not.toContain("Change avatar");
    expect(html).not.toContain("Change profile banner");
  });
});
