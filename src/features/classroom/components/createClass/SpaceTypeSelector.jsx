import {
  GraduationCap,
  BookOpen,
  Users,
  FolderKanban,
  Building2,
  Globe,
  Check,
} from "lucide-react";
import { SPACE_TYPES } from "../../model/createSpaceForm.js";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Space Type <span className="text-secondary">*</span>
          </label>
          <p className="text-[12px] text-text-muted">
            Configures identity, meeting style, and audience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {SPACE_TYPES.map((type) => {
          const isSelected = currentType === type.id;
          const Icon = ICON_MAP[type.icon] || Globe;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => update("spaceType", type.id)}
              className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all duration-150 focus:outline-none min-h-[72px] sm:min-h-[76px] cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/8 text-primary shadow-xs ring-1 ring-primary"
                  : "border-border bg-surface text-text-main hover:border-border/80 hover:bg-canvas/50"
              }`}
              title={`${type.label}: ${type.description}`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary text-surface"
                    : "bg-primary/10 text-primary group-hover:bg-primary/15"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="mt-1.5 line-clamp-1 text-xs font-medium">
                {type.label}
              </span>

              <span className="text-[10px] text-text-muted">
                {type.badge}
              </span>

              {isSelected && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-surface">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
