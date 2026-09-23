import { Link } from "react-router";
import { routes } from "@/routes/paths";

export function InviteOnlyMessage({ course }) {
  return (
    <div className="text-center py-2">
      <div className="rounded-xl border border-border/70 bg-canvas p-4">
        <div className="text-sm font-medium text-text-heading">
          {course?.title || "Classroom"}
        </div>
        <p className="mt-2 text-xs text-text-muted">
          This space is invite-only. Please contact the space owner or admin to
          be added.
        </p>
      </div>
      <Link
        to={routes.dashboard}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-main transition hover:bg-canvas"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
