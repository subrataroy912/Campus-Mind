import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

export function CreatorUnlockBanner({
  isStudentWithoutCreator,
  handleUnlock,
  isUnlocking,
  unlockError,
}) {
  if (!isStudentWithoutCreator) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-sm text-amber-950 dark:text-amber-200 shadow-xs"
      role="alert"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-semibold text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
            Unlock Course Creation Privileges
          </p>
          <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            Your account is currently registered as a <strong>Student</strong>.
            Unlock creator privileges to set up classes, lead study groups, or host workshops.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleUnlock}
          disabled={isUnlocking}
          size="sm"
          className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-medium"
        >
          {isUnlocking ? "Unlocking…" : "Unlock course creation"}
        </Button>
      </div>
      {unlockError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-300 font-medium">
          {unlockError}
        </p>
      )}
    </div>
  );
}
