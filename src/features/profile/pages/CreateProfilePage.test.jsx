import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import CreateProfilePage from "./CreateProfilePage.jsx";

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
  useBlocker: () => ({ state: "unblocked", proceed: vi.fn(), reset: vi.fn() }),
  useBeforeUnload: vi.fn(),
}));

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@example.com", profileCompleted: false },
    completeOnboarding: vi.fn().mockResolvedValue({}),
    cancelOnboarding: vi.fn().mockResolvedValue({}),
    updateProfile: vi.fn().mockResolvedValue({}),
    updateHandle: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock("../api/profileApi.js", () => ({
  useGetCurrentProfileQuery: () => ({
    data: { data: { id: "user-1", email: "test@example.com" } },
  }),
}));

vi.mock("@/components/ui/toast.jsx", () => ({
  toast: { add: vi.fn() },
}));

describe("CreateProfilePage Component", () => {
  it("renders Create Your Profile heading and description", () => {
    const html = renderToString(<CreateProfilePage />);
    expect(html).toContain("Create Your Profile");
    expect(html).toContain(
      "Set up your public presence, details, and avatar to get started.",
    );
    expect(html).toContain("Save Profile");
  });
});
