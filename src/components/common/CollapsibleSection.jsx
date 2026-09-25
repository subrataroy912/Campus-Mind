import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { safeParseStorageJson, safeLocalStorageSet } from "@/utils/storage.js";

export function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultExpanded = true,
  storageKey,
  action,
  className = "",
  headerClassName = "",
  contentClassName = "",
  badge,
}) {
  const [isExpanded, setIsExpanded] = useState(() => {
    if (!storageKey) return defaultExpanded;
    return safeParseStorageJson(storageKey, defaultExpanded);
  });

  useEffect(() => {
    if (storageKey) {
      safeLocalStorageSet(storageKey, JSON.stringify(isExpanded));
    }
  }, [isExpanded, storageKey]);

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-border transition-all ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-3 p-4 sm:p-5 ${headerClassName}`}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="group flex h-auto min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg p-0 hover:bg-transparent text-left"
          aria-expanded={isExpanded}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-base font-bold text-text-heading transition-colors group-hover:text-primary sm:text-lg">
                {title}
              </h2>
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-text-muted sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-canvas/80 text-text-muted transition-transform duration-200 group-hover:bg-primary/10 group-hover:text-primary">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </div>
        </Button>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {isExpanded && (
        <div
          className={`border-t border-border px-4 py-4 sm:px-6 sm:py-5 ${contentClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
