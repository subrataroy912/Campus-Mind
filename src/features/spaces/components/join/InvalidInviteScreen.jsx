import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { routes } from "@/routes/paths";

export function InvalidInviteScreen() {
  return (
    <div className="py-4 text-center space-y-3">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h2 className="text-base font-bold text-text-heading">
        Invitation Expired or Invalid
      </h2>
      <p className="text-xs text-text-muted max-w-sm mx-auto">
        This invitation link has expired (links are valid for 48 hours) or has
        been revoked. Please ask the space owner or admin for a new link.
      </p>
      <Link
        to={routes.spaces.list}
        className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-xs"
      >
        Back to spaces
      </Link>
    </div>
  );
}
