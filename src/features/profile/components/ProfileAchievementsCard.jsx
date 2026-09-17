import { Trophy, Star, Lock, CheckCircle2, MessageSquare, Heart, BarChart2 } from "lucide-react";
import { ReputationBadge } from "./ReputationBadge.jsx";
import { REPUTATION_BADGES, DEFAULT_USER_ACHIEVEMENTS } from "./reputationConstants.js";
import { cn } from "@/lib/utils.js";

export function ProfileAchievementsCard({
  achievements = DEFAULT_USER_ACHIEVEMENTS,
  className = "",
}) {
  const { reputationPoints, level, unlockedBadgeIds = [], stats = {} } = achievements;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs space-y-4",
        className
      )}
    >
      {/* Header with Level and Points */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-text-heading">
                Campus Reputation
              </span>
              <span className="rounded-md bg-accent/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                {level}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Earn points by contributing study notes and helping classmates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-canvas px-3 py-1.5 border border-border/80 text-xs font-bold text-text-heading">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{reputationPoints} Karma Points</span>
        </div>
      </div>

      {/* Badges Showcase */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Badges & Honors
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.values(REPUTATION_BADGES).map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3 border transition-all",
                  isUnlocked
                    ? "border-border bg-canvas/60 hover:bg-canvas/90"
                    : "border-border/50 bg-canvas/30 opacity-60"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {isUnlocked ? (
                    <ReputationBadge badgeId={badge.id} size="sm" />
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-canvas px-2 py-0.5 text-[11px] font-medium text-text-muted">
                      <Lock className="h-3 w-3" />
                      <span>{badge.title}</span>
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-xs">
                  <p className="text-text-main font-medium leading-snug">
                    {badge.description}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>Completed · {badge.criteria}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 text-text-muted shrink-0" />
                        <span>Goal: {badge.criteria}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagement Quick Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60 text-center">
        <div className="rounded-xl bg-canvas/50 p-2 border border-border/50">
          <div className="flex items-center justify-center gap-1 text-rose-500 mb-0.5">
            <Heart className="h-3.5 w-3.5 fill-rose-500" />
            <span className="text-sm font-bold text-text-heading">
              {stats.reactionsReceived || 0}
            </span>
          </div>
          <span className="text-[10px] text-text-muted">Reactions Earned</span>
        </div>

        <div className="rounded-xl bg-canvas/50 p-2 border border-border/50">
          <div className="flex items-center justify-center gap-1 text-primary mb-0.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-sm font-bold text-text-heading">
              {stats.discussionsJoined || 0}
            </span>
          </div>
          <span className="text-[10px] text-text-muted">Discussions</span>
        </div>

        <div className="rounded-xl bg-canvas/50 p-2 border border-border/50">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
            <BarChart2 className="h-3.5 w-3.5" />
            <span className="text-sm font-bold text-text-heading">
              {stats.pollsParticipated || 0}
            </span>
          </div>
          <span className="text-[10px] text-text-muted">Polls Voted</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileAchievementsCard;
