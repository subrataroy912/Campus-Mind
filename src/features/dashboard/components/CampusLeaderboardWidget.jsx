import { Trophy, Award, Flame, ArrowUpRight } from "lucide-react";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { ReputationBadge } from "@/features/profile/components/ReputationBadge.jsx";
import { WEEKLY_LEADERBOARD } from "../data/leaderboardData.js";
import { cn } from "@/lib/utils.js";

const RANK_BADGES = {
  1: { emoji: "🥇", bg: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  2: { emoji: "🥈", bg: "bg-slate-400/15 text-slate-600 border-slate-400/30" },
  3: { emoji: "🥉", bg: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
};

export function CampusLeaderboardWidget({ className = "" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs space-y-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Trophy className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-heading">
              Weekly Campus Scholars
            </h3>
            <p className="text-[11px] text-text-muted">
              Ranked by helpful answers, study streak, and peer karma
            </p>
          </div>
        </div>

        <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-bold text-text-muted border border-border">
          Resets in 3d 14h
        </span>
      </div>

      {/* Top 5 Scholars List */}
      <div className="space-y-2.5">
        {WEEKLY_LEADERBOARD.map((scholar) => {
          const rankMeta = RANK_BADGES[scholar.rank];

          return (
            <div
              key={scholar.rank}
              className="flex items-center justify-between gap-2.5 rounded-xl border border-border/70 bg-canvas/40 p-2.5 transition-all hover:bg-canvas/80"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank indicator */}
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold border",
                    rankMeta ? rankMeta.bg : "border-border bg-canvas text-text-muted font-mono"
                  )}
                >
                  {rankMeta ? rankMeta.emoji : `#${scholar.rank}`}
                </div>

                <ClassroomAvatar
                  avatar={scholar.avatar}
                  name={scholar.name}
                  size="h-8 w-8"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-text-heading truncate">
                      {scholar.name}
                    </p>
                    <ReputationBadge badgeId={scholar.badgeId} size="sm" />
                  </div>
                  <p className="text-[10px] text-text-muted truncate">
                    {scholar.topContribution}
                  </p>
                </div>
              </div>

              {/* Points & Streak */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-bold text-primary tabular-nums">
                  {scholar.points} pts
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600">
                  <Flame className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                  <span>{scholar.streakDays}d</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Rank Card Footer */}
      <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <div>
            <span className="font-bold text-text-heading">Your Rank: #14</span>
            <span className="text-[11px] text-text-muted ml-1.5">· 480 pts</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
          310 pts to Top 10 <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

export default CampusLeaderboardWidget;
