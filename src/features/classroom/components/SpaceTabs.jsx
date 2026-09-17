import { CLASS_TABS } from "../data/classPageData.js";

export function SpaceTabs({
  active,
  onChange,
  spaceType = "ACADEMIC_CLASS",
}) {
  const isAcademic = spaceType === "ACADEMIC_CLASS";

  const visibleTabs = CLASS_TABS.filter((tab) => {
    if (tab.academicOnly && !isAcademic) return false;
    return true;
  });

  return (
    <div className="mt-2.5 sm:mt-3 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 shadow-xs ring-1 ring-border">
      {visibleTabs.map((tab) => {
        const label = !isAcademic && tab.altLabel ? tab.altLabel : tab.label;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? "bg-surface text-text-heading shadow-xs"
                : "text-text-muted hover:text-text-heading hover:bg-surface/50"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export const ClassTabs = SpaceTabs;
export default SpaceTabs;
