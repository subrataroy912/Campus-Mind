import { useState } from "react";
import { Users, Hand, UserCheck, Sparkles } from "lucide-react";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { SUGGESTED_STUDY_BUDDIES } from "../data/studyBuddiesData.js";
import { cn } from "@/lib/utils.js";

export function StudyBuddiesWidget({ className = "" }) {
  const [buddies] = useState(SUGGESTED_STUDY_BUDDIES);
  const [connectedIds, setConnectedIds] = useState(new Set());
  const [wavedIds, setWavedIds] = useState(new Set());
  const [waveNotice, setWaveNotice] = useState(null);

  const handleWave = (buddy) => {
    setWavedIds((prev) => new Set(prev).add(buddy.id));
    setWaveNotice(`Waved 👋 at ${buddy.name}!`);
    setTimeout(() => setWaveNotice(null), 2000);
  };

  const handleConnect = (buddyId) => {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(buddyId)) next.delete(buddyId);
      else next.add(buddyId);
      return next;
    });
  };

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-heading">
              Study Buddies & Classmates
            </h3>
            <p className="text-[11px] text-text-muted">
              Connect with students enrolled in your spaces
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>Recommended</span>
        </span>
      </div>

      {/* Wave Toast */}
      {waveNotice && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-2 text-center text-xs font-bold text-primary animate-in fade-in">
          {waveNotice}
        </div>
      )}

      {/* Buddies List */}
      <div className="space-y-3">
        {buddies.map((buddy) => {
          const isConnected = connectedIds.has(buddy.id);
          const hasWaved = wavedIds.has(buddy.id);

          return (
            <div
              key={buddy.id}
              className="flex items-center justify-between gap-2.5 rounded-xl border border-border/70 bg-canvas/40 p-3 transition-all hover:bg-canvas/80"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <ClassroomAvatar
                    avatar={buddy.avatar}
                    name={buddy.name}
                    size="h-9 w-9"
                  />
                  {buddy.isOnline && (
                    <span
                      className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"
                      title="Online now"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-heading truncate">
                    {buddy.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {buddy.major}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-surface px-1.5 py-0.2 text-[9px] font-semibold text-text-muted border border-border/60 mt-0.5">
                    {buddy.sharedSpacesCount} shared spaces
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleWave(buddy)}
                  disabled={hasWaved}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition cursor-pointer disabled:opacity-50",
                    hasWaved
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                      : "border-border bg-canvas hover:bg-primary/5 hover:text-primary hover:border-primary/40"
                  )}
                  title={hasWaved ? "Waved!" : "Wave at classmate"}
                >
                  <Hand className="h-3.5 w-3.5" />
                </button>

                <Button
                  size="sm"
                  variant={isConnected ? "outline" : "default"}
                  onClick={() => handleConnect(buddy.id)}
                  className={cn(
                    "h-7 px-2.5 text-xs font-semibold rounded-lg transition cursor-pointer",
                    isConnected && "border-primary/40 text-primary bg-primary/5"
                  )}
                >
                  {isConnected ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <span>Connect</span>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudyBuddiesWidget;
