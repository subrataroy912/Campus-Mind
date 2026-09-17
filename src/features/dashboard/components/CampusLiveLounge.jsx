import { useState, useEffect } from "react";
import { Coffee, Radio, Plus, Timer, LogOut, CheckCircle2 } from "lucide-react";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { INITIAL_STUDY_TABLE } from "../data/liveStudyData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { cn } from "@/lib/utils.js";

export function CampusLiveLounge({ className = "" }) {
  const { user } = useAuth();
  const [students, setStudents] = useState(INITIAL_STUDY_TABLE);
  const [userSession, setUserSession] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [cheerNotice, setCheerNotice] = useState(null);

  // User Pomodoro countdown
  useEffect(() => {
    if (!userSession) return;

    const timer = setInterval(() => {
      setUserSession((prev) => {
        if (!prev || prev.remainingSeconds <= 1) {
          clearInterval(timer);
          return null;
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userSession]);

  const handleSendCoffee = (studentId) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, coffeeCount: s.coffeeCount + 1 } : s))
    );
    const targetStudent = students.find((s) => s.id === studentId);
    setCheerNotice(`Sent ☕ to ${targetStudent?.name || "classmate"}!`);
    setTimeout(() => setCheerNotice(null), 2000);
  };

  const handleJoinTable = (e) => {
    e.preventDefault();
    const task = taskInput.trim() || "Deep Focus Session";

    setUserSession({
      task,
      totalSeconds: durationMinutes * 60,
      remainingSeconds: durationMinutes * 60,
      startedAt: new Date(),
    });

    setIsJoinModalOpen(false);
    setTaskInput("");
  };

  const handleLeaveTable = () => {
    setUserSession(null);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs space-y-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Radio className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-text-heading">
                Campus Live Study Lounge
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {students.length + (userSession ? 1 : 0)} Live
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Virtual study tables with focus timers and silent cheers
            </p>
          </div>
        </div>

        <div>
          {userSession ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Timer className="h-4 w-4 animate-spin" />
              <span>{formatTimer(userSession.remainingSeconds)} remaining</span>
              <button
                type="button"
                onClick={handleLeaveTable}
                className="ml-2 text-text-muted hover:text-destructive transition p-0.5 cursor-pointer"
                title="Leave study table"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsJoinModalOpen(true)}
              className="h-8 gap-1.5 rounded-xl bg-primary text-xs font-semibold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Sit at Study Table</span>
            </Button>
          )}
        </div>
      </div>

      {/* Cheer Floating Alert */}
      {cheerNotice && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2 text-center text-xs font-bold text-amber-600 dark:text-amber-400 animate-in fade-in">
          {cheerNotice}
        </div>
      )}

      {/* Live Active Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Current User Card if active */}
        {userSession && (
          <div className="relative rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 p-3 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClassroomAvatar
                  avatar={user?.avatarUrl || user?.avatar}
                  name={user?.name || "You"}
                  size="h-8 w-8"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-heading truncate">
                    You (Active)
                  </p>
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    In Focus Session
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                {formatTimer(userSession.remainingSeconds)}
              </span>
            </div>

            <p className="text-xs font-medium text-text-main line-clamp-1">
              🎯 {userSession.task}
            </p>
          </div>
        )}

        {/* Other Active Classmates */}
        {students.map((student) => (
          <div
            key={student.id}
            className="group relative rounded-xl border border-border bg-canvas/60 p-3 space-y-2 transition-all hover:border-border/90 hover:bg-canvas/90"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative">
                  <ClassroomAvatar
                    avatar={student.avatar}
                    name={student.name}
                    size="h-8 w-8"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-surface" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-heading truncate">
                    {student.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {student.spaceName}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-medium text-text-muted tabular-nums">
                {student.durationMinutes}m
              </span>
            </div>

            <p className="text-xs font-medium text-text-main line-clamp-1">
              📖 {student.task}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                {student.status}
              </span>
              <button
                type="button"
                onClick={() => handleSendCoffee(student.id)}
                className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 hover:bg-amber-500/20 transition cursor-pointer"
                title="Send Coffee Cheer"
              >
                <Coffee className="h-3 w-3" />
                <span>{student.coffeeCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Join Study Table Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Radio className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-text-heading">
                  Join Virtual Study Table
                </DialogTitle>
                <DialogDescription className="text-xs text-text-muted">
                  Share what you're working on and stay accountable with classmates.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleJoinTable} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold text-text-heading">
                What are you focusing on today?
              </label>
              <Input
                type="text"
                placeholder="e.g. Distributed Systems Lab 3, Midterm Review…"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="mt-1 h-9 text-xs sm:text-sm bg-canvas/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-heading">
                Pomodoro Focus Duration
              </label>
              <div className="mt-1.5 flex gap-2">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={cn(
                      "flex-1 rounded-xl border py-1.5 text-xs font-bold transition cursor-pointer select-none",
                      durationMinutes === mins
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-canvas/40 text-text-muted hover:text-text-heading"
                    )}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsJoinModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Start Focus Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CampusLiveLounge;
