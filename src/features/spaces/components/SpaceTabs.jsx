import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CLASS_TABS } from "../data/classPageData.js";

export default function SpaceTabs({ active, onChange, onPrefetch, isStaff = false }) {
  const visibleTabs = CLASS_TABS.filter((tab) => !tab.staffOnly || isStaff);

  return (
    <div className="mt-2 flex gap-1 overflow-x-auto rounded-lg bg-muted/40 p-1 border border-border/60 scrollbar-none">
      {visibleTabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Button
            key={tab.id}
            type="button"
            variant="ghost"
            size="sm"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            onMouseEnter={() => onPrefetch?.(tab.id)}
            onFocus={() => onPrefetch?.(tab.id)}
            className={cn(
              "inline-flex min-h-8 sm:min-h-7 h-auto items-center justify-center shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              isActive
                ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60 hover:bg-card"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
