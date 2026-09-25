import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function InviteOnlyModal({ isOpen, onClose, cardTitle }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 shrink-0">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div className="text-left">
              <DialogTitle
                id="invite-only-dialog-title"
                className="text-base font-bold text-text-heading"
              >
                Invite Only Class
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Private learning space
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="mt-1 text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-text-heading">{cardTitle}</span>{" "}
          is an invite-only class. Only invited members can access
          this course. Please request an invitation link or code from the
          instructor.
        </p>

        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="px-4 text-xs font-semibold cursor-pointer"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteOnlyModal;