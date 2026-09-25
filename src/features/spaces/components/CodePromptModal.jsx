import { Link } from "react-router";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isJoining && onClose()}>
      <DialogContent className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle
                id="code-prompt-dialog-title"
                className="text-base font-bold text-text-heading truncate"
              >
                Enter Class Code
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted truncate">
                Code required to join this class
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="mt-1 text-xs text-text-muted">
          Enter the code provided by your instructor to join{" "}
          <span className="font-semibold text-text-heading">{cardTitle}</span>.
        </p>

        <form onSubmit={onSubmit} className="mt-2 space-y-3">
          <div>
            <Input
              type="text"
              autoFocus
              value={classCode}
              onChange={(e) => onChangeCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCD1234"
              maxLength={16}
              aria-label="Class Code"
              className="h-10 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-center font-mono text-base font-semibold tracking-wider text-text-heading uppercase"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isJoining}
                className="text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!classCode.trim() || isJoining}
                className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
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
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CodePromptModal;
