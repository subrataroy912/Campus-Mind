import { CLASS_TABS } from "../data/classPageData.js";

export default function ClassTabs({ active, onChange, spaceType = "ACADEMIC_CLASS" }) {
  const isAcademic = spaceType === "ACADEMIC_CLASS";

  const visibleTabs = CLASS_TABS.filter((tab) => {
    if (tab.academicOnly && !isAcademic) return false;
    return true;
  });

  return (
    <div className="mt-2 flex gap-1 overflow-x-auto rounded-lg bg-muted/40 p-1 border border-border/60 scrollbar-none">
      {visibleTabs.map((tab) => {
        const label = (!isAcademic && tab.altLabel) ? tab.altLabel : tab.label;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
