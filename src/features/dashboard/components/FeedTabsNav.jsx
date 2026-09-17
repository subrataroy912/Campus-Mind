import { FEED_TABS, CONTENT_FILTERS } from "./feedNavConstants.js";
import { cn } from "@/lib/utils.js";

export function FeedTabsNav({
  activeTab = "for-you",
  onTabChange,
  activeFilter = "all",
  onFilterChange,
  className = "",
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Primary Discovery Tabs */}
      <div
        className="flex items-center gap-1 rounded-2xl border border-border bg-surface/80 p-1.5 shadow-2xs backdrop-blur-xs"
        role="tablist"
        aria-label="Feed Discovery Tabs"
      >
        {FEED_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                  : "text-text-muted hover:text-text-heading hover:bg-canvas/60"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className="truncate">{tab.label}</span>
              {tab.badge && !isActive && (
                <span className="hidden sm:inline-flex rounded-full bg-destructive/15 px-1.5 py-0.2 text-[10px] font-bold text-destructive">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters / Topics */}
      <div
        className="-mx-1 flex max-w-full items-center gap-1.5 overflow-x-auto px-1 py-1 no-scrollbar"
        role="tablist"
        aria-label="Filter content type"
      >
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider px-1 hidden sm:inline">
          Filter:
        </span>
        {CONTENT_FILTERS.map((filter) => {
          const isSelected = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onFilterChange && onFilterChange(filter.id)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap select-none",
                isSelected
                  ? "bg-text-heading text-background font-semibold shadow-xs"
                  : "bg-surface border border-border text-text-muted hover:text-text-heading hover:border-text-muted/40"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FeedTabsNav;
