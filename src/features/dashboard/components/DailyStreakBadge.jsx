import { useState, useRef, useEffect } from "react";
import { Flame, Trophy, CheckCircle2, Award, X } from "lucide-react";
import { loadUserStreak } from "@/features/profile/utils/streakUtils.js";
import { cn } from "@/lib/utils.js";

export function DailyStreakBadge({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [streakData] = useState(() => loadUserStreak());
  const popoverRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const count = streakData?.count || 1;
  const bestStreak = streakData?.bestStreak || count;
  const daysToNextMilestone = Math.max(1, (Math.floor(count / 7) + 1) * 7 - count);

  return (
    <div ref={popoverRef} className={cn("relative inline-flex items-center", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Daily Streak: ${count} days active`}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition cursor-pointer select-none",
          count >= 3
            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
            : "bg-canvas text-text-muted hover:text-text-main border border-border"
        )}
      >
        <Flame
          className={cn(
            "h-4 w-4 fill-amber-500 text-amber-500 animate-pulse",
            count >= 5 && "scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
          )}
        />
        <span>{count}</span>
      </button>

      {/* Streak Popover Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Daily Streak Progress"
          className="absolute top-full right-0 mt-2 z-50 w-72 sm:w-80 rounded-2xl border border-border bg-surface p-4 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Flame className="h-6 w-6 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-heading">
                  {count} Day Streak!
                </h4>
                <p className="text-[11px] text-text-muted">
                  Personal best: {bestStreak} day{bestStreak === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-main transition cursor-pointer"
              aria-label="Close streak details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Weekly Calendar Dots */}
          <div className="py-3">
            <p className="text-[11px] font-semibold text-text-muted mb-2">
              This Week's Activity
            </p>
            <div className="flex items-center justify-between px-1">
              {(streakData?.weeklyDays || []).map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted">
                    {day.label}
                  </span>
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                      day.active
                        ? "bg-amber-500 text-white shadow-xs shadow-amber-500/30"
                        : "bg-canvas border border-border/80 text-text-muted",
                      day.isToday && "ring-2 ring-primary ring-offset-1"
                    )}
                  >
                    {day.active ? "✓" : "·"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Goals Checklist */}
          <div className="rounded-xl border border-border/70 bg-canvas/50 p-2.5 space-y-2">
            <p className="text-[11px] font-bold text-text-heading flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span>Today's Habit Checklist</span>
            </p>

            <div className="space-y-1.5 text-xs text-text-main">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px]">Logged in today</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px]">Explored Campus Pulse feed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px]">Shared a reaction or discussion</span>
              </div>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="mt-3 flex items-center justify-between text-xs text-text-muted pt-1">
            <span className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Streak Master Badge</span>
            </span>
            <span className="font-semibold text-text-heading text-[11px]">
              {daysToNextMilestone} day{daysToNextMilestone === 1 ? "" : "s"} left
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyStreakBadge;
