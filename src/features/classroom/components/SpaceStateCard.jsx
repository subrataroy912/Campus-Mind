import { Link } from "react-router";
import { AlertCircle, HelpCircle, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

/**
 * Reusable card for space not-found, unavailable, or restricted states.
 */
export function SpaceStateCard({
  type = "not-found", // "not-found" | "error" | "unavailable"
  title,
  description,
  spaceId,
}) {
  const isNotFound = type === "not-found";

  const defaultTitle = isNotFound
    ? "Space Not Found"
    : "Space Unavailable";

  const defaultDescription = isNotFound
    ? "This space is unavailable or you are not enrolled as a member yet."
    : "This space cannot be loaded at the moment. Please try again later.";

  const effectiveTitle = title || defaultTitle;
  const effectiveDesc = description || defaultDescription;

  return (
    <div className="grid min-h-[60vh] place-items-center bg-canvas px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-text-muted">
          {isNotFound ? (
            <HelpCircle className="h-6 w-6 text-text-muted" />
          ) : (
            <AlertCircle className="h-6 w-6 text-destructive" />
          )}
        </div>

        <h2 className="text-lg font-bold text-text-heading">
          {effectiveTitle}
        </h2>
        <p className="mt-1.5 text-xs text-text-muted leading-relaxed">
          {effectiveDesc}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          {spaceId && isNotFound && (
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-primary text-xs font-semibold text-white shadow-xs hover:bg-primary-hover"
            >
              <Link
                to={`${routes.spaces.join}?courseId=${encodeURIComponent(
                  spaceId
                )}`}
              >
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                Join this space
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-border text-xs font-medium text-text-main hover:bg-canvas"
          >
            <Link to={routes.spaces.list}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to spaces
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SpaceStateCard;
