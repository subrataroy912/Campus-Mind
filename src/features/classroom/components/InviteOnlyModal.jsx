import { Lock, X } from "lucide-react";

export function InviteOnlyModal({ isOpen, onClose, cardTitle }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-only-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 shrink-0">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 id="invite-only-dialog-title" className="text-base font-bold text-text-heading">
                Invite Only Class
              </h3>
              <p className="text-xs text-text-muted">Private learning space</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-3 text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-text-heading">{cardTitle}</span>{" "}
          is an invite-only class. Only invited members can access
          this course. Please request an invitation link or code from the
          instructor.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteOnlyModal;