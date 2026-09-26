import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ProfileForm from "./ProfileForm.jsx";
import CreateProfilePage from "../../pages/CreateProfilePage.jsx";

// Mock react-router
vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
  useBlocker: () => ({ state: "unblocked", proceed: vi.fn(), reset: vi.fn() }),
  useBeforeUnload: vi.fn(),
}));

// Mock auth context
vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    updateProfile: vi.fn().mockResolvedValue({}),
    updateHandle: vi.fn().mockResolvedValue({}),
    user: {},
  }),
}));

// Mock profile api
vi.mock("../../api/profileApi.js", () => ({
  useGetCurrentProfileQuery: () => ({ data: null, isLoading: false }),
}));

describe("ProfileForm Component", () => {
  it("renders all form sections with default props and read-only handle with change action", () => {
    const html = renderToString(
      <ProfileForm
        profile={{
          firstName: "Alex",
          lastName: "Morgan",
          handle: "alexm",
          headline: "CS Student",
        }}
        onChangeHandleClick={() => {}}
      />
    );

    expect(html).toContain("Identity");
    expect(html).toContain("Alex");
    expect(html).toContain("Morgan");
    expect(html).toContain("alexm");
    expect(html).toContain("Change handle");
    expect(html).toContain("About &amp; Bio");
    expect(html).toContain("CS Student");
    expect(html).toContain("Location &amp; Visibility");
    expect(html).toContain("Personal Information");
    expect(html).toContain("Social &amp; Web Links");
    expect(html).toContain("Save changes");
    // Media section is hidden by default
    expect(html).not.toContain("Upload banner");
  });

  it("renders media section when showMedia is true", () => {
    const html = renderToString(
      <ProfileForm
        showMedia={true}
        submitLabel="Save Profile"
      />
    );

    expect(html).toContain("Upload banner (recommended 1200x300)");
    expect(html).toContain("Avatar");
    expect(html).toContain("Save Profile");
  });

  it("renders custom links in links section", () => {
    const html = renderToString(
      <ProfileForm
        profile={{
          links: [
            { name: "GitHub", url: "https://github.com/alex" },
            { name: "Portfolio", url: "https://alex.dev" },
          ],
        }}
      />
    );

    expect(html).toContain("GitHub");
    expect(html).toContain("https://github.com/alex");
    expect(html).toContain("Portfolio");
    expect(html).toContain("https://alex.dev");
  });
});

describe("CreateProfilePage", () => {
  it("renders Create Your Profile heading and ProfileForm with media enabled", () => {
    const html = renderToString(<CreateProfilePage />);

    expect(html).toContain("Create Your Profile");
    expect(html).toContain("Set up your public presence, details, and avatar to get started.");
    expect(html).toContain("Upload banner");
    expect(html).toContain("Save Profile");
  });
});
