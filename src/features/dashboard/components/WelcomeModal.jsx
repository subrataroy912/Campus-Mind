import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({
  greetingName = "there",
  userId,
  isLongTimeAway = false,
}) {
  const [modalState, setModalState] = useState(() => {
    if (!userId || typeof window === "undefined") {
      return { open: false, variant: null };
    }

    // 1. Fresh Profile Creation Check
    const freshProfileKey = `just_created_profile_${userId}`;
    const wasFresh =
      sessionStorage.getItem(freshProfileKey) === "true" ||
      sessionStorage.getItem("show_welcome_after_profile_create") === "true";

    if (wasFresh) {
      sessionStorage.removeItem(freshProfileKey);
      sessionStorage.removeItem("show_welcome_after_profile_create");
      return { open: true, variant: "freshProfile" };
    }

    // 2. Long Time Away Check (3-4 days: >= 3 days)
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const lastActiveKey = `last_active_at_${userId}`;
    const lastActive = localStorage.getItem(lastActiveKey);
    const now = Date.now();

    const isAway = Boolean(
      isLongTimeAway ||
      (lastActive && now - Number(lastActive) >= THREE_DAYS_MS)
    );

    const awaySessionKey = `seen_welcome_away_${userId}`;
    const alreadySeenAwayThisSession = sessionStorage.getItem(awaySessionKey);

    // Record last active timestamp
    localStorage.setItem(lastActiveKey, String(now));

    if (isAway && !alreadySeenAwayThisSession) {
      sessionStorage.setItem(awaySessionKey, "true");
      return { open: true, variant: "longTimeAway" };
    }

    return { open: false, variant: null };
  });

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const lastActiveKey = `last_active_at_${userId}`;
    localStorage.setItem(lastActiveKey, String(Date.now()));
  }, [userId]);

  const handleOpenChange = (isOpen) => {
    setModalState((prev) => ({ ...prev, open: isOpen }));
  };

  if (!modalState.open) {
    return null;
  }

  const isFresh = modalState.variant === "freshProfile";

  return (
    <Dialog open={modalState.open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md overflow-hidden p-0 sm:rounded-xl">
        {/* Top Graphic Accent Banner */}
        <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              {isFresh ? "Welcome to CampusMind" : "Your learning space"}
            </span>
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              {isFresh
                ? `Welcome, ${greetingName}!`
                : `Welcome back, ${greetingName}!`}
            </DialogTitle>
          </div>

          <div className="h-12 w-20 shrink-0">
            <img
              src="/images/dashboard-welcome.svg"
              alt="CampusMind Welcome"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 px-5 py-4">
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            {isFresh
              ? "Your profile has been created successfully. Explore spaces, participate in community discussions, or customize your learning journey."
              : "Pick up right where you left off in your enrolled spaces, check announcements, or discover active topics happening across the CampusMind community."}
          </DialogDescription>

          <div className="flex justify-end pt-1">
            <Button
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="h-8 px-4 text-xs font-medium"
            >
              {isFresh ? "Start Exploring" : "Get Started"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
