import { Link } from "react-router";
import { ArrowRight, KeyRound, Loader2, X } from "lucide-react";
import { routes } from "@/routes/paths";

export function CodePromptModal({
  isOpen,
  onClose,
  onSubmit,
  cardTitle,
  courseId,
  classCode,
  onChangeCode,
  joinError,
  isJoining,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-prompt-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={() => !isJoining && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3
                id="code-prompt-dialog-title"
                className="text-base font-bold text-text-heading truncate"
              >
                Enter Class Code
              </h3>
              <p className="text-xs text-text-muted truncate">
                Code required to join this class
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isJoining}
            className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-3 text-xs text-text-muted">
          Enter the code provided by your instructor to join{" "}
          <span className="font-semibold text-text-heading">{cardTitle}</span>.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              autoFocus
              value={classCode}
              onChange={(e) => onChangeCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCD1234"
              maxLength={16}
              aria-label="Class Code"
              className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-center font-mono text-base font-semibold tracking-wider text-text-heading uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {joinError && (
              <p className="mt-1.5 text-xs text-destructive">{joinError}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to={`${routes.classes.join}?courseId=${encodeURIComponent(
                courseId
              )}&accessType=code`}
              onClick={onClose}
              className="text-[11px] text-text-muted hover:text-primary hover:underline"
            >
              Dedicated join page
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isJoining}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!classCode.trim() || isJoining}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
              >
                {isJoining ? (
                  <>
                    <Loader2
                      size={13}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Join & Open</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CodePromptModal;
