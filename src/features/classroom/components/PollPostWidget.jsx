import { useState } from "react";
import { CheckCircle2, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils.js";

export function PollPostWidget({
  poll,
  onVote,
  disabled = false,
  className = "",
}) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    poll?.userVotedOptionId || null
  );
  const [hasVoted, setHasVoted] = useState(Boolean(poll?.userVotedOptionId));

  if (!poll || !poll.options || poll.options.length === 0) return null;

  // Compute total votes
  const totalVotes =
    poll.totalVotes ??
    poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  const handleVote = (optionId) => {
    if (disabled || hasVoted) return;
    setSelectedOptionId(optionId);
    setHasVoted(true);
    if (onVote) {
      onVote(optionId);
    }
  };

  return (
    <div
      className={cn(
        "mt-3 rounded-2xl border border-border/80 bg-canvas/60 p-3 sm:p-4 space-y-2.5",
        className
      )}
    >
      {poll.question && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-heading">
          <BarChart2 className="h-3.5 w-3.5 text-primary" />
          <span>{poll.question}</span>
        </div>
      )}

      <div className="space-y-2">
        {poll.options.map((option, idx) => {
          const optVotes = option.votes || 0;
          // Dynamically adjust count if just voted
          const effectiveVotes =
            hasVoted && selectedOptionId === option.id && !poll.userVotedOptionId
              ? optVotes + 1
              : optVotes;
          const effectiveTotal =
            hasVoted && !poll.userVotedOptionId ? totalVotes + 1 : totalVotes;

          const percentage =
            effectiveTotal > 0
              ? Math.round((effectiveVotes / effectiveTotal) * 100)
              : 0;
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id || idx}
              type="button"
              disabled={disabled || hasVoted}
              onClick={() => handleVote(option.id || idx)}
              className={cn(
                "relative w-full overflow-hidden rounded-xl border text-left text-xs transition cursor-pointer select-none",
                hasVoted
                  ? "border-border/60 bg-surface"
                  : "border-border bg-surface hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
                isSelected && "border-primary/60 ring-1 ring-primary/40 font-semibold"
              )}
            >
              {/* Animated Progress Bar fill */}
              {hasVoted && (
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-500 rounded-xl",
                    isSelected ? "bg-primary/20" : "bg-canvas"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center justify-between p-2.5 sm:px-3 z-10">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {hasVoted && isSelected && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <span
                    className={cn(
                      "truncate font-medium",
                      isSelected ? "text-primary font-bold" : "text-text-main"
                    )}
                  >
                    {option.text || option.label}
                  </span>
                </div>

                {hasVoted && (
                  <span className="text-[11px] font-bold text-text-heading shrink-0 tabular-nums">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Poll Metadata Footer */}
      <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
        <span>
          {`${hasVoted && !poll.userVotedOptionId ? totalVotes + 1 : totalVotes} vote${(hasVoted && !poll.userVotedOptionId ? totalVotes + 1 : totalVotes) === 1 ? "" : "s"}`}
        </span>
        <span>{poll.status || "Active poll"}</span>
      </div>
    </div>
  );
}

export default PollPostWidget;
