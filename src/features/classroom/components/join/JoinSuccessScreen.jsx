import { Link } from "react-router";
import { Check } from "lucide-react";
import { routes } from "@/routes/paths";

export function JoinSuccessScreen({ joinedClass, onReset }) {
  if (!joinedClass) return null;

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Check className="h-5 w-5 stroke-[2.5]" />
      </div>
      <h2 className="text-base font-bold text-text-heading">
        You've joined {joinedClass.title}
      </h2>
      <p className="mt-0.5 text-xs text-text-muted">
        {joinedClass.subtitle ? `${joinedClass.subtitle} • ` : ""}created by{" "}
        {joinedClass.owner?.name ||
          joinedClass.ownerName ||
          "Space Owner"}
      </p>
      <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          to={routes.spaces.detail(joinedClass.id)}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-hover shadow-xs"
        >
          Open space
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-xs font-medium text-text-main transition hover:bg-canvas cursor-pointer"
        >
          Join another
        </button>
      </div>
    </div>
  );
}
