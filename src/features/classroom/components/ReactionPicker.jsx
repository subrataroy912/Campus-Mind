import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import { REACTIONS } from "./reactionConstants.js";
import { cn } from "@/lib/utils.js";

export function ReactionPicker({
  userReaction = null,
  onSelectReaction,
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const activeReactionMeta = REACTIONS.find((r) => r.id === userReaction);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (userReaction) {
      // Toggle off if already selected
      onSelectReaction && onSelectReaction(null);
    } else {
      // Default to Love or open picker
      onSelectReaction && onSelectReaction("LOVE");
    }
  };

  const handleSelect = (reactionId, e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsOpen(false);
    if (userReaction === reactionId) {
      onSelectReaction && onSelectReaction(null);
    } else {
      onSelectReaction && onSelectReaction(reactionId);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative inline-flex items-center", className)}
    >
      {/* Floating Reaction Dock Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Reaction Options"
          className="absolute bottom-full left-0 mb-2 z-50 flex items-center gap-1 rounded-full border border-border/80 bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {REACTIONS.map((reaction) => {
            const isSelected = userReaction === reaction.id;
            return (
              <button
                key={reaction.id}
                type="button"
                onClick={(e) => handleSelect(reaction.id, e)}
                title={reaction.label}
                className={cn(
                  "group relative flex h-8 w-8 items-center justify-center rounded-full text-base transition-all transform hover:scale-130 active:scale-95 cursor-pointer",
                  isSelected && "bg-primary/15 ring-2 ring-primary/40 scale-110"
                )}
              >
                <span className="select-none transition-transform group-hover:scale-125">
                  {reaction.emoji}
                </span>
                {/* Micro tooltip */}
                <span className="pointer-events-none absolute -top-7 hidden rounded-md bg-text-heading px-1.5 py-0.5 text-[10px] font-semibold text-background shadow-xs group-hover:block whitespace-nowrap">
                  {reaction.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-label={activeReactionMeta ? `Reacted with ${activeReactionMeta.label}` : "Add reaction"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition cursor-pointer select-none",
          activeReactionMeta
            ? "bg-primary/10 text-primary font-semibold"
            : "text-text-muted hover:bg-canvas hover:text-text-main"
        )}
      >
        {activeReactionMeta ? (
          <>
            <span className="text-sm scale-110 select-none">
              {activeReactionMeta.emoji}
            </span>
            <span>{activeReactionMeta.label}</span>
          </>
        ) : (
          <>
            <SmilePlus className="h-3.5 w-3.5" />
            <span>React</span>
          </>
        )}
      </button>
    </div>
  );
}

export default ReactionPicker;
