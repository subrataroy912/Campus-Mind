import { TrendingUp, Flame, Hash } from "lucide-react";
import { TRENDING_TOPICS } from "./trendingTopicsConstants.js";
import { cn } from "@/lib/utils.js";

export function TrendingTopicsWidget({
  activeTopic = null,
  onSelectTopic,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-3 sm:p-4 shadow-2xs space-y-2.5",
        className
      )}
    >
      <div className="flex items-center justify-between pb-1 border-b border-border/50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-heading">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Trending on Campus</span>
        </div>
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
          Live Buzz
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TRENDING_TOPICS.map((topic) => {
          const isSelected = activeTopic === topic.tag;

          return (
            <button
              key={topic.tag}
              type="button"
              onClick={() => onSelectTopic && onSelectTopic(isSelected ? null : topic.tag)}
              title={`${topic.tag}: ${topic.description}`}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer select-none",
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-canvas border border-border text-text-muted hover:text-text-heading hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              {topic.isHot && !isSelected ? (
                <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
              ) : (
                <Hash className="h-3 w-3 opacity-60" />
              )}
              <span>{topic.tag}</span>
              <span
                className={cn(
                  "rounded-full px-1 py-0.2 text-[10px] tabular-nums",
                  isSelected
                    ? "bg-primary-foreground/20 text-white"
                    : "text-text-muted bg-surface/80"
                )}
              >
                {topic.postsCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TrendingTopicsWidget;
