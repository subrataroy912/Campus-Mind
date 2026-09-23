import { isRouteErrorResponse, useRouteError } from "react-router";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import BrandLogo from "@/components/common/BrandLogo.jsx";
import { routes } from "@/routes/paths.js";

function RouteErrorConsumer({ isInline, resetErrorBoundary }) {
  const routeError = useRouteError();
  return (
    <RouteErrorContent
      error={routeError}
      isInline={isInline}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

function RouteErrorContent({ error, isInline, resetErrorBoundary }) {
  let title = "Something went wrong";
  let description = "An unexpected error occurred while loading this page.";
  let statusBadge = null;

  const isRouterResponse =
    isRouteErrorResponse(error) ||
    (error && typeof error.status === "number");

  if (isRouterResponse) {
    statusBadge = `${error.status}`;
    if (error.status === 404) {
      title = "Page not found";
      description =
        "The page you are looking for doesn't exist or may have been moved.";
    } else if (error.status === 401 || error.status === 403) {
      title = "Access restricted";
      description =
        "You do not have permission to view this page or resource.";
    } else if (error.status >= 500) {
      title = "Service unavailable";
      description =
        "Our servers encountered an unexpected issue. Please try again in a few moments.";
    } else {
      title = error.statusText || "Route error";
      description =
        typeof error.data === "string"
          ? error.data
          : "An error occurred while loading this route.";
    }
  } else if (error instanceof Error) {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message?.includes("Failed to fetch dynamically imported module") ||
      error.message?.includes("Loading chunk");

    if (isChunkError) {
      title = "Update available";
      description =
        "A new version of Campus Mind is available. Please reload the application to update.";
    } else {
      title = "Application error";
      description =
        error.message || "An unexpected error occurred while rendering.";
    }
  }

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  if (isInline) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="m-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-border/80 bg-card p-6 text-center sm:p-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        {statusBadge && (
          <span className="mt-3 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {`Error ${statusBadge}`}
          </span>
        )}
        <h2 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleReload} size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>
          <Button
            variant="outline"
            size="sm"
            to={routes.dashboard}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>

        {import.meta.env.DEV && error?.stack && (
          <details className="mt-6 w-full max-w-xl text-left">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
              Technical Details (Dev Only)
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted/60 p-3 font-mono text-[11px] text-muted-foreground">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return (
    <main
      role="alert"
      aria-live="assertive"
      className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-8 text-foreground"
    >
      <div className="mb-6 flex justify-center">
        <BrandLogo />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-surface p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>

        {statusBadge && (
          <span className="mt-3 inline-block rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
            {`Error ${statusBadge}`}
          </span>
        )}

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        <p className="mt-2 text-sm text-text-muted">{description}</p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button onClick={handleReload} size="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
          <Button
            variant="outline"
            size="default"
            to={routes.home}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        {import.meta.env.DEV && error?.stack && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
              Technical Details (Dev Only)
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted/60 p-3 font-mono text-[11px] text-muted-foreground">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}

/**
 * Route Error Boundary Component.
 *
 * Catches unhandled routing exceptions, 4xx/5xx route responses,
 * and chunk dynamic import errors. Provides accessible recovery UI
 * in both full-screen (root route) and inline (dashboard layout) modes.
 */
export default function RouteErrorBoundary({
  error: explicitError,
  isInline = false,
  resetErrorBoundary,
}) {
  if (explicitError) {
    return (
      <RouteErrorContent
        error={explicitError}
        isInline={isInline}
        resetErrorBoundary={resetErrorBoundary}
      />
    );
  }

  return (
    <RouteErrorConsumer
      isInline={isInline}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}
