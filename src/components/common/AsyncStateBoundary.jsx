import EmptyState from "./EmptyState.jsx";
import ErrorState from "./ErrorState.jsx";
import { InlineLoader, LoadingFallback } from "./LoadingState.jsx";

/**
 * Centralized declarative boundary for handling loading skeletons/spinners,
 * error states (with retry), empty states, and stale-while-revalidate background updates.
 */
export default function AsyncStateBoundary({
  isLoading = false,
  isFetching = false,
  hasData = false,
  error = null,
  isEmpty = false,
  loadingFallback = "spinner",
  errorFallback = null,
  errorTitle = "We could not load this content",
  errorDescription,
  onRetry,
  isRetrying = false,
  errorAction,
  emptyFallback = null,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  showInlineFetching = false,
  fetchingLabel = "Updating…",
  compact = false,
  className,
  children,
}) {
  // 1. Stale-While-Revalidate: Never block or flash a skeleton if cached/resolved data is already available
  if (!hasData) {
    if (isLoading) {
      return <LoadingFallback fallback={loadingFallback} compact={compact} />;
    }

    if (error) {
      if (errorFallback) return errorFallback;
      return (
        <ErrorState
          error={error}
          title={errorTitle}
          description={errorDescription}
          onRetry={onRetry}
          isRetrying={isRetrying || isFetching}
          action={errorAction}
          compact={compact}
          className={className}
        />
      );
    }

    if (isEmpty) {
      if (emptyFallback) return emptyFallback;
      return (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      );
    }
  }

  const content = typeof children === "function" ? children() : children;

  if (showInlineFetching && isFetching) {
    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <InlineLoader label={fetchingLabel} />
        </div>
        {content}
      </div>
    );
  }

  return content;
}

export { AsyncStateBoundary };
