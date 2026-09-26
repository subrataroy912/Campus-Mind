import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { OnboardingDiscardDialog } from "./OnboardingDiscardDialog.jsx";

vi.mock("@/components/ui/alert-dialog.jsx", () => ({
  AlertDialog: ({ open, children }) =>
    open ? <div data-slot="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }) => <div>{children}</div>,
  AlertDialogCancel: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  AlertDialogAction: ({ children, onClick, disabled, variant }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe("OnboardingDiscardDialog Component", () => {
  it("renders with default title and buttons when open", () => {
    const html = renderToString(
      <OnboardingDiscardDialog
        open={true}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(html).toContain("Discard profile creation?");
    expect(html).toContain("If you leave, your registration will be cancelled");
    expect(html).toContain("Discard &amp; Exit");
    expect(html).toContain("Continue Setup");
  });

  it("renders custom title and action labels", () => {
    const html = renderToString(
      <OnboardingDiscardDialog
        open={true}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
        title="Custom Title"
        description="Custom Description"
        confirmLabel="Custom Confirm"
        cancelLabel="Custom Cancel"
      />,
    );

    expect(html).toContain("Custom Title");
    expect(html).toContain("Custom Description");
    expect(html).toContain("Custom Confirm");
    expect(html).toContain("Custom Cancel");
  });

  it("does not render when open is false", () => {
    const html = renderToString(
      <OnboardingDiscardDialog
        open={false}
        onOpenChange={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(html).toBe("");
  });
});
