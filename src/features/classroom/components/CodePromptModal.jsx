import { Link } from "react-router";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { routes } from "@/routes/paths";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export function CodePromptModal({
  isOpen,
  onClose,
  onSubmit,
  cardTitle,
  _courseId,
  classCode,
  onChangeCode,
  joinError,
  isJoining,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isJoining && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound size={18} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-heading">
                Enter Space Code
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Code required to join this space
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-xs text-text-muted mt-1">
          Enter the code provided by your facilitator or instructor to join{" "}
          <span className="font-semibold text-text-heading">{cardTitle}</span>.
        </p>

        <form onSubmit={onSubmit} className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="space-code-prompt-input"
              className="text-xs font-semibold text-text-main"
            >
              Space Code
            </label>
            <Input
              id="space-code-prompt-input"
              type="text"
              value={classCode}
              onChange={(e) => onChangeCode(e.target.value.toUpperCase())}
              placeholder="e.g. CS101A"
              maxLength={16}
              autoFocus
              disabled={isJoining}
              className="h-10 text-center font-mono text-sm tracking-wider uppercase"
            />
          </div>

          {joinError && (
            <p className="text-xs text-destructive font-medium" role="alert">
              {joinError}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              to={routes.spaces.join}
              onClick={onClose}
              className="inline-flex items-center gap-1 font-medium text-text-muted hover:text-text-heading hover:underline"
            >
              <span>Have an 8-digit invite?</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isJoining}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isJoining || !classCode?.trim()}
              className="text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Joining…</span>
                </>
              ) : (
                <span>Join space</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CodePromptModal;
