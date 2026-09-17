import { useMemo } from "react";
import { REACTIONS } from "./reactionConstants.js";
import { cn } from "@/lib/utils.js";

export function ReactionSummary({
  reactions = {},
  totalCount = 0,
  onClick,
  className = "",
}) {
  // Extract reactions that have counts > 0
  const activeReactions = useMemo(() => {
    return REACTIONS.map((r) => ({
      ...r,
      count: reactions[r.id] || 0,
    })).filter((r) => r.count > 0);
  }, [reactions]);

  const computedTotal = useMemo(() => {
    if (typeof totalCount === "number" && totalCount > 0) return totalCount;
    return activeReactions.reduce((sum, r) => sum + r.count, 0);
  }, [totalCount, activeReactions]);

  if (computedTotal <= 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-canvas/80 px-2 py-0.5 text-xs font-medium text-text-muted hover:bg-canvas hover:text-text-main border border-border/60 transition cursor-pointer select-none",
        className
      )}
      title={`${computedTotal} reaction${computedTotal === 1 ? "" : "s"}`}
    >
      <div className="flex -space-x-1 overflow-hidden">
        {activeReactions.slice(0, 3).map((r) => (
          <span key={r.id} className="text-[13px] leading-none select-none">
            {r.emoji}
          </span>
        ))}
      </div>
      <span className="text-[11px] font-semibold text-text-main ml-0.5">
        {computedTotal}
      </span>
    </button>
  );
}

export default ReactionSummary;
