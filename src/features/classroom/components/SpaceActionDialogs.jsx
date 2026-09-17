import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";

/**
 * Reusable modal dialogs for space lifecycle actions: Archive, Delete, and Leave.
 */
export function SpaceActionDialogs({
  spaceTitle = "this space",
  isArchiveOpen,
  onArchiveClose,
  onArchiveConfirm,
  isArchiving = false,
  isDeleteOpen,
  onDeleteClose,
  onDeleteConfirm,
  isDeleting = false,
  isLeaveOpen,
  onLeaveClose,
  onLeaveConfirm,
  isLeaving = false,
}) {
  return (
    <>
      {/* Archive Dialog */}
      <Dialog open={isArchiveOpen} onOpenChange={(open) => !open && !isArchiving && onArchiveClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-heading">
              Archive space?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Archiving hides this space from active rosters and explore lists.
              Members will retain view-only access, but no new coursework or announcements can be created.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onArchiveClose}
              disabled={isArchiving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onArchiveConfirm}
              disabled={isArchiving}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isArchiving ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Archiving…</span>
                </>
              ) : (
                <span>Archive space</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => !open && !isDeleting && onDeleteClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive">
              Delete space permanently?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Are you sure you want to delete <span className="font-semibold text-text-heading">{spaceTitle}</span>?
              This action cannot be undone. All coursework, submissions, grades, and shared links will be permanently erased.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteClose}
              disabled={isDeleting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="text-xs font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Deleting…</span>
                </>
              ) : (
                <span>Delete permanently</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Dialog */}
      <Dialog open={isLeaveOpen} onOpenChange={(open) => !open && !isLeaving && onLeaveClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-heading">
              Leave space?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Are you sure you want to leave <span className="font-semibold text-text-heading">{spaceTitle}</span>?
              You will lose access to space materials, announcements, and submissions unless re-invited.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLeaveClose}
              disabled={isLeaving}
              className="text-xs"
            >
              Stay
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onLeaveConfirm}
              disabled={isLeaving}
              className="text-xs font-semibold"
            >
              {isLeaving ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Leaving…</span>
                </>
              ) : (
                <span>Leave space</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SpaceActionDialogs;
