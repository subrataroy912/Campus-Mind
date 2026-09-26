import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ChangeHandleModal } from "./ChangeHandleModal.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    updateHandle: vi.fn().mockResolvedValue({ handle: "updated_handle" }),
  }),
}));

vi.mock("@/components/ui/dialog.jsx", () => ({
  Dialog: ({ open, children }) => (open ? <div data-slot="dialog">{children}</div> : null),
  DialogContent: ({ children, className }) => <div className={className}>{children}</div>,
  DialogHeader: ({ children, className }) => <div className={className}>{children}</div>,
  DialogTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
  DialogDescription: ({ children, className }) => <p className={className}>{children}</p>,
}));

describe("ChangeHandleModal Component", () => {
  it("renders modal with remaining changes and current handle when open", () => {
    const html = renderToString(
      <ChangeHandleModal
        isOpen={true}
        onClose={() => {}}
        currentHandle="current_user"
        remainingChanges={2}
      />
    );

    expect(html).toContain("Change username / handle");
    expect(html).toContain("current_user");
    expect(html).toContain("of 3 remaining (14-day window)");
    expect(html).toContain("Update handle");
  });

  it("renders rate limited warning when remaining changes is 0", () => {
    const html = renderToString(
      <ChangeHandleModal
        isOpen={true}
        onClose={() => {}}
        currentHandle="current_user"
        remainingChanges={0}
        nextAllowedChangeAt="2026-10-09T12:00:00Z"
      />
    );

    expect(html).toContain("Rate limit reached (3 changes in 14 days)");
    expect(html).toContain("You can change your handle again after");
  });

  it("does not render when isOpen is false", () => {
    const html = renderToString(
      <ChangeHandleModal
        isOpen={false}
        onClose={() => {}}
        currentHandle="current_user"
      />
    );

    expect(html).toBe("");
  });
});
