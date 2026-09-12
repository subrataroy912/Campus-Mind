import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultExpanded = true,
  action,
  className = "",
  headerClassName = "",
  contentClassName = "",
  badge,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-border transition-all ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-3 p-4 sm:p-5 ${headerClassName}`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg group cursor-pointer"
          aria-expanded={isExpanded}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text-heading sm:text-lg group-hover:text-primary transition-colors truncate">
                {title}
              </h2>
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-text-muted truncate sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-canvas/80 text-text-muted transition-transform duration-200 group-hover:bg-primary/10 group-hover:text-primary shrink-0">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

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
