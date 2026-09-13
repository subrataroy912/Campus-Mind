import {
  GraduationCap,
  BookOpen,
  Users,
  FolderKanban,
  Building2,
  Globe,
  Check,
} from "lucide-react";
import { SPACE_TYPES } from "../../model/createClassForm.js";

const ICON_MAP = {
  GraduationCap,
  BookOpen,
  Users,
  FolderKanban,
  Building2,
  Globe,
};

export default function SpaceTypeSelector({ form, update }) {
  const currentType = form.spaceType || "ACADEMIC_CLASS";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Choose Space Type
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Select the type of group you want to create. This shapes its features, defaults, and discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SPACE_TYPES.map((type) => {
          const isSelected = currentType === type.id;
          const Icon = ICON_MAP[type.icon] || Globe;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => update("spaceType", type.id)}
              className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-150 focus:outline-none ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-surface hover:border-border/80 hover:bg-canvas/40"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-primary text-surface"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                {isSelected ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-surface shadow-xs">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-text-muted">
                    {type.badge}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold text-text-heading">
                  {type.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-text-muted line-clamp-2">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
