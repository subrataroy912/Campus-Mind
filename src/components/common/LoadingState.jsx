import { Skeleton } from "../ui/skeleton.jsx";
import { Spinner } from "../ui/spinner.jsx";
import { cn } from "@/lib/utils.js";

/**
 * Compact pill with a spinner and label for background revalidation or pagination.
 */
export function InlineLoader({ label = "Updating…", className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary",
        className,
      )}
    >
      <Spinner className="h-3 w-3 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

/**
 * Centered spinner card for compact panels, dialogs, or invite verification.
 */
export function SectionLoader({
  label = "Loading…",
  compact = false,
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 text-center text-xs text-muted-foreground",
        compact ? "px-3 py-4" : "px-4 py-8",
        className,
      )}
    >
      <Spinner className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-primary")} />
      <span>{label}</span>
    </div>
  );
}

/**
 * Skeleton preset for Space Stream & Community announcement feeds.
 */
export function FeedSkeleton({ count = 3, className }) {
  return (
    <div
      role="status"
      aria-label="Loading stream updates"
      className={cn("space-y-2.5", className)}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-md shrink-0" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton preset for Classwork assignments & materials lists.
 */
export function CourseworkListSkeleton({ count = 4, className }) {
  return (
    <div
      role="status"
      aria-label="Loading coursework"
      className={cn("space-y-2", className)}
    >
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-6 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card divide-y divide-border/60 shadow-2xs">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 px-3.5 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-48 max-w-full" />
                <Skeleton className="h-2.5 w-28" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton preset for Member rosters (list mode) or Explore People (grid mode).
 */
export function MemberListSkeleton({
  count = 6,
  layout = "list",
  className,
}) {
  if (layout === "grid") {
    return (
      <div
        role="status"
        aria-label="Loading people"
        className={cn(
          "grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3",
          className,
        )}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-center rounded-lg border border-border/70 bg-surface/90 px-3 py-2.5 shadow-2xs min-h-[56px]"
          >
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading members"
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 divide-y divide-border/60 bg-card shadow-2xs",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton preset for Gradebook tables.
 */
export function TableSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div
      role="status"
      aria-label="Loading table data"
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 bg-surface shadow-xs",
        className,
      )}
    >
      <div className="grid grid-cols-4 gap-3 border-b border-border/70 bg-canvas/60 px-3.5 py-2.5">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className="h-3 w-20" />
        ))}
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-4 items-center gap-3 px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-16 justify-self-end rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton preset for Post / Coursework comment discussions.
 */
export function CommentListSkeleton({ count = 2, className }) {
  return (
    <div
      role="status"
      aria-label="Loading discussion"
      className={cn("space-y-2 py-1", className)}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          <div className="flex-1 rounded-lg bg-muted/40 px-3 py-2 space-y-1.5">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton preset for Chat Message History inside a conversation pane.
 */
export function ChatHistorySkeleton({ count = 5, className }) {
  return (
    <div
      role="status"
      aria-label="Loading conversation history"
      className={cn("space-y-3 py-2", className)}
    >
      {Array.from({ length: count }).map((_, idx) => {
        const isSelf = idx % 2 === 1;
        return (
          <div
            key={idx}
            className={cn(
              "flex items-end gap-2",
              isSelf ? "justify-end" : "justify-start",
            )}
          >
            {!isSelf && <Skeleton className="h-7 w-7 rounded-full shrink-0" />}
            <div
              className={cn(
                "space-y-1.5 rounded-2xl p-3",
                isSelf ? "bg-primary/10 w-52" : "bg-surface border border-border/60 w-60",
              )}
            >
              {!isSelf && <Skeleton className="h-2.5 w-20" />}
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Skeleton preset for the full two-column MessagesPage layout.
 */
export function ChatLayoutSkeleton({ className }) {
  return (
    <div
      role="status"
      aria-label="Loading space chat rooms"
      className={cn(
        "mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col p-2 sm:p-3",
        className,
      )}
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-xl border border-border/80 bg-surface shadow-xs lg:grid-cols-[300px_1fr]">
        {/* Left Sidebar Skeleton */}
        <div className="flex flex-col border-border/70 lg:border-r p-3 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="space-y-2 pt-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Chat Pane Skeleton */}
        <div className="hidden lg:flex flex-col justify-between p-4">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
          <ChatHistorySkeleton count={4} />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function LoadingFallback({ fallback, compact = false }) {
  if (!fallback || fallback === "spinner") {
    return <SectionLoader compact={compact} />;
  }
  if (typeof fallback === "string") {
    switch (fallback) {
      case "feed":
        return <FeedSkeleton />;
      case "coursework":
        return <CourseworkListSkeleton />;
      case "members":
        return <MemberListSkeleton layout="list" />;
      case "people-grid":
        return <MemberListSkeleton layout="grid" />;
      case "table":
        return <TableSkeleton />;
      case "comments":
        return <CommentListSkeleton />;
      case "chat-history":
        return <ChatHistorySkeleton />;
      case "chat-layout":
        return <ChatLayoutSkeleton />;
      default:
        return <SectionLoader label={fallback} compact={compact} />;
    }
  }
  return fallback;
}
