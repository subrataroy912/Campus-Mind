import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils.js";

/**
 * Robust in-page dropdown select that stays strictly confined to trigger width
 * and automatically flips upward if near the bottom of the viewport.
 */
export function SpaceSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = "Select an option…",
  className,
  error,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 230 && rect.top > spaceBelow);
    }
    setIsOpen((prev) => !prev);
  };

  // Click outside and Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => {
    const optVal = typeof opt === "string" ? opt : (opt.value ?? opt.id);
    return String(optVal).toUpperCase() === String(value || "").toUpperCase();
  });

  const getLabel = (opt) => {
    if (!opt) return "";
    if (typeof opt === "string") return opt;
    return opt.label || opt.name || opt.title || opt.id;
  };

  const getDesc = (opt) => {
    if (!opt || typeof opt === "string") return null;
    return opt.description || opt.desc || null;
  };

  const displayLabel = selectedOption
    ? getLabel(selectedOption)
    : value || placeholder;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border bg-canvas px-3 py-1.5 text-xs text-text-main transition-all cursor-pointer select-none focus:outline-hidden",
          error
            ? "border-secondary focus:ring-1 focus:ring-secondary/40"
            : "border-border hover:border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20",
          isOpen && "border-primary ring-1 ring-primary/20 shadow-xs",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selectedOption && !value && "text-text-muted"
          )}
        >
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-text-muted transition-transform duration-150 shrink-0",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={cn(
            "absolute left-0 w-full z-50 rounded-xl border border-border bg-surface shadow-xl py-1 max-h-56 overflow-y-auto overscroll-contain animate-in fade-in-50 zoom-in-95 duration-100",
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {options.map((opt) => {
            const optVal =
              typeof opt === "string" ? opt : (opt.value ?? opt.id);
            const isSelected =
              String(optVal).toUpperCase() === String(value || "").toUpperCase();
            const label = getLabel(opt);
            const desc = getDesc(opt);

            return (
              <div
                key={optVal}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-text-main hover:bg-canvas"
                )}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="truncate text-xs font-medium">{label}</div>
                  {desc && (
                    <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5 font-normal">
                      {desc}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SpaceSelect;
