import React, { useState, useEffect } from "react";
import { AtSign, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field.jsx";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import { useAuth } from "@/context/AuthContext.jsx";
import ValidateField from "../utils/profileValidation.js";

export function ChangeHandleModal({
  isOpen,
  onClose,
  currentHandle = "",
  remainingChanges = 3,
  nextAllowedChangeAt = null,
  onSuccess,
}) {
  const { updateHandle } = useAuth();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHandle(currentHandle || "");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, currentHandle]);

  if (!isOpen) return null;

  const isRateLimited = remainingChanges <= 0;
  const normalizedCurrent = (currentHandle || "").trim().toLowerCase().replace(/^@+/, "");
  const normalizedNew = (handle || "").trim().toLowerCase().replace(/^@+/, "");
  const isUnchanged = normalizedNew === normalizedCurrent;

  const formattedResetDate = nextAllowedChangeAt
    ? new Date(nextAllowedChangeAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/^@+/, "");
    setHandle(raw);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (isRateLimited) {
      setError("You have reached the maximum of 3 handle changes per 14 days.");
      return;
    }

    const validationError = ValidateField("handle", normalizedNew);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isUnchanged) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateHandle({ handle: normalizedNew });
      toast.add({
        title: "Username updated",
        description: `Your handle is now @${normalizedNew}`,
        type: "success",
      });
      if (onSuccess) {
        onSuccess(normalizedNew);
      }
      onClose();
    } catch (err) {
      const parsed = parseApiError(err, "Failed to update handle.");
      setError(parsed.message);
      toast.add({
        title: "Could not update handle",
        description: parsed.message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-md bg-surface p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle className="text-lg font-semibold text-text-heading">
            Change username / handle
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted mt-0.5">
            Your unique handle across spaces, comments, and mentions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Rate limit status card */}
          {isRateLimited ? (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Rate limit reached (3 changes in 14 days)</p>
                <p className="mt-0.5 opacity-90">
                  {formattedResetDate
                    ? `You can change your handle again after ${formattedResetDate}.`
                    : "You have used all 3 handle changes for this 14-day period."}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border/70 bg-card p-3 text-xs text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Remaining changes:
              </span>
              <span className="font-semibold text-foreground">
                {remainingChanges} of 3 remaining (14-day window)
              </span>
            </div>
          )}

          {/* Current Handle */}
          <div className="text-xs text-muted-foreground">
            Current handle:{" "}
            <span className="font-mono font-medium text-foreground">
              @{normalizedCurrent || "none"}
            </span>
          </div>

          {/* New Handle Input */}
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="change-handle-input">New username</FieldLabel>
            <div className="relative flex items-center mt-1">
              <span className="absolute left-3 text-sm text-muted-foreground select-none">
                @
              </span>
              <Input
                id="change-handle-input"
                className="pl-7 font-mono"
                value={handle}
                disabled={isRateLimited || isSubmitting}
                onChange={handleChange}
                placeholder="new_username"
                maxLength={30}
                autoFocus
              />
            </div>
            {error ? (
              <FieldError id="change-handle-error" className="mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </FieldError>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1.5">
                3 to 30 characters. Letters, numbers, and underscores only.
              </p>
            )}
          </Field>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isRateLimited || isSubmitting || !normalizedNew || isUnchanged}
            >
              {isSubmitting ? "Updating…" : "Update handle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeHandleModal;
