import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({ greetingName = "there", userId }) {
  const [open, setOpen] = useState(() => {
    if (!userId || typeof window === "undefined") return false;
    const storageKey = `seen_welcome_${userId}`;
    const hasSeen = sessionStorage.getItem(storageKey);
    if (!hasSeen) {
      sessionStorage.setItem(storageKey, "true");
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const storageKey = `seen_welcome_${userId}`;
    const hasSeenModal = sessionStorage.getItem(storageKey);

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem(storageKey, "true");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md overflow-hidden p-0 sm:rounded-xl">
        {/* Top Graphic Accent Banner */}
        <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Your learning space
            </span>
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              Welcome back, {greetingName}!
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
            Pick up right where you left off in your enrolled spaces, check
            announcements, or discover active topics happening across the
            CampusMind community.
          </DialogDescription>

          <div className="flex justify-end pt-1">
            <Button
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 px-4 text-xs font-medium"
            >
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
