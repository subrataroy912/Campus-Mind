import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  FolderKanban,
  Building2,
  Globe,
  Check,
  ChevronDown,
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
  const selected =
    SPACE_TYPES.find((t) => t.id === currentType) || SPACE_TYPES[0];
  const SelectedIcon = ICON_MAP[selected.icon] || Globe;

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="space-y-1" ref={rootRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Space Type <span className="text-secondary">*</span>
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <SelectedIcon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-text-main">
              {selected.label}
            </div>
            <div className="truncate text-[11px] text-text-muted">
              {selected.description}
            </div>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-border bg-surface p-1 shadow-md"
          >
            {SPACE_TYPES.map((type) => {
              const isSelected = currentType === type.id;
              const Icon = ICON_MAP[type.icon] || Globe;

              return (
                <li key={type.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      update("spaceType", type.id);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/8 text-primary"
                        : "text-text-main hover:bg-canvas/60"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        isSelected
                          ? "bg-primary text-surface"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-medium">
                          {type.label}
                        </span>
                        <span className="shrink-0 text-[10px] text-text-muted">
                          {type.badge}
                        </span>
                      </div>
                      <div className="truncate text-[11px] text-text-muted">
                        {type.description}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0 stroke-[3] text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
