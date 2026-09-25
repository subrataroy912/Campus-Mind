import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import { cn } from "@/lib/utils.js";

export default function ErrorState({
  error,
  title = "Something went wrong",
  description,
  onRetry,
  isRetrying = false,
  action,
  compact = false,
  className,
}) {
  const resolvedDescription =
    description ||
    (typeof error === "string"
      ? error
      : error && typeof error === "object"
        ? parseApiError(error, "Please check your connection and try again.")
            .message
        : "Please check your connection and try again.");

  if (compact) {
    return (
      <div
        role="alert"
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs",
          className,
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle
            className="h-3.5 w-3.5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <span className="truncate font-medium text-foreground">
            {resolvedDescription || title}
          </span>
        </div>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="h-6 gap-1 px-2 text-[11px] shrink-0"
          >
            <RefreshCw
              className={cn("h-3 w-3", isRetrying && "animate-spin")}
              aria-hidden="true"
            />
            <span>{isRetrying ? "Retrying…" : "Retry"}</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-card/60 px-4 py-6 text-center sm:py-8",
        className,
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
      </div>
      <h3 className="mt-2.5 text-xs font-semibold tracking-tight text-foreground sm:text-sm">
        {title}
      </h3>
      {resolvedDescription && (
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-normal">
          {resolvedDescription}
        </p>
      )}
      {(onRetry || action) && (
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="h-7 gap-1.5 px-3 text-xs"
            >
              <RefreshCw
                className={cn("h-3 w-3", isRetrying && "animate-spin")}
                aria-hidden="true"
              />
              <span>{isRetrying ? "Retrying…" : "Try again"}</span>
            </Button>
          )}
          {action && (
            <Button
              to={action.to}
              onClick={action.onClick}
              size="sm"
              className="h-7 px-3 text-xs"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { ErrorState };
