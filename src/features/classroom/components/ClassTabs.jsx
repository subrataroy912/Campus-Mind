import { CLASS_TABS } from "../data/classPageData.js";

export default function ClassTabs({ active, onChange, onPrefetch, isStaff = false }) {
  const visibleTabs = CLASS_TABS.filter((tab) => !tab.staffOnly || isStaff);

  return (
    <div className="mt-2 flex gap-1 overflow-x-auto rounded-lg bg-muted/40 p-1 border border-border/60 scrollbar-none">
      {visibleTabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            onMouseEnter={() => onPrefetch?.(tab.id)}
            onFocus={() => onPrefetch?.(tab.id)}
            className={`inline-flex min-h-8 sm:min-h-7 items-center justify-center shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
