import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

export function InviteOnlyModal({ isOpen, onClose, cardTitle }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 shrink-0">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-heading">
                Invite-Only Space
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Private learning & collaboration space
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="mt-2 text-xs text-text-muted leading-relaxed">
          <span className="font-semibold text-text-heading">{cardTitle}</span>{" "}
          is an invite-only space. Only invited members can access
          this space. Please request an invitation link or direct invite from the
          space lead.
        </p>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InviteOnlyModal;