import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { cn } from "@/lib/utils.js";

const STORY_DURATION_MS = 5000;

function StoryViewerContent({
  userStories = [],
  initialUserIndex = 0,
  onClose,
}) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reactionSent, setReactionSent] = useState(null);

  const currentUserGroup = userStories[currentUserIndex];
  const stories = currentUserGroup?.stories || [];
  const currentStory = stories[currentStoryIndex];

  const handleNext = useCallback(() => {
    setProgress(0);
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentUserIndex < userStories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose?.();
    }
  }, [currentStoryIndex, stories.length, currentUserIndex, userStories.length, onClose]);

  const handlePrev = useCallback(() => {
    setProgress(0);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = userStories[currentUserIndex - 1];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex((prevUser.stories?.length || 1) - 1);
    }
  }, [currentStoryIndex, currentUserIndex, userStories]);

  // Auto-advance progress bar timer
  useEffect(() => {
    if (!currentStory) return;

    const intervalMs = 50;
    const increment = (intervalMs / STORY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [currentStory, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  const handleSendReaction = (emoji) => {
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1500);
  };

  if (!currentUserGroup || !currentStory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Segmented Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => {
            let fillPct = 0;
            if (idx < currentStoryIndex) fillPct = 100;
            else if (idx === currentStoryIndex) fillPct = progress;

            return (
              <div
                key={s.id || idx}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-xs"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ClassroomAvatar
              avatar={currentUserGroup.avatar}
              name={currentUserGroup.authorName}
              size="h-9 w-9"
            />
            <div>
              <p className="text-xs font-bold text-white leading-none">
                {currentUserGroup.authorName}
              </p>
              <p className="text-[10px] text-white/70 mt-0.5">
                {currentStory.timeAgo || "Today"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-black/40 p-1.5 text-white/80 hover:bg-black/60 hover:text-white transition cursor-pointer"
            aria-label="Close story"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Click Zones for Prev/Next */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer" onClick={handleNext} />

        {/* Media / Background */}
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-neutral-950">
          {currentStory.mediaUrl ? (
            <img
              src={currentStory.mediaUrl}
              alt="Campus story drop"
              className="h-full w-full object-cover select-none"
            />
          ) : (
            <div
              className={cn(
                "h-full w-full flex items-center justify-center p-8 text-center",
                currentStory.bgGradient || "bg-gradient-to-tr from-primary to-indigo-600"
              )}
            >
              <p className="text-lg sm:text-xl font-bold leading-relaxed text-white">
                {currentStory.caption}
              </p>
            </div>
          )}

          {/* Caption overlay for image stories */}
          {currentStory.mediaUrl && currentStory.caption && (
            <div className="absolute bottom-16 inset-x-0 z-25 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-white">
                {currentStory.caption}
              </p>
            </div>
          )}

          {/* Reaction animation pop */}
          {reactionSent && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
              <span className="text-6xl select-none drop-shadow-lg">
                {reactionSent}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Reaction Bar */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between gap-2 rounded-2xl bg-black/50 p-2 backdrop-blur-md">
          <input
            type="text"
            placeholder="Reply to story…"
            className="flex-1 rounded-xl bg-white/15 px-3 py-1.5 text-xs text-white placeholder:text-white/60 outline-none focus:bg-white/20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleSendReaction("👏");
                e.target.value = "";
              }
            }}
          />

          <div className="flex items-center gap-1">
            {["❤️", "🔥", "👏", "🤯"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSendReaction(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-base transition-transform hover:scale-125 active:scale-95 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoryViewerModal({ isOpen = false, ...props }) {
  if (!isOpen) return null;
  return <StoryViewerContent key={`${props.initialUserIndex}`} {...props} />;
}

export default StoryViewerModal;
