import { useState } from "react";
import { Plus } from "lucide-react";
import { ClassroomAvatar } from "@/features/classroom/components/ClassroomAvatar.jsx";
import { StoryViewerModal } from "./StoryViewerModal.jsx";
import { CreateStoryModal } from "./CreateStoryModal.jsx";
import { INITIAL_STORIES } from "../data/storiesData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { cn } from "@/lib/utils.js";

export function CampusStoriesBar({ className = "" }) {
  const { user } = useAuth();
  const [storiesList, setStoriesList] = useState(INITIAL_STORIES);
  const [userStory, setUserStory] = useState(null);

  const [activeStoryUserIndex, setActiveStoryUserIndex] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Combine user story (if created) with community stories
  const allStoryGroups = userStory
    ? [
        {
          id: "my-story",
          authorName: user?.name || "You",
          avatar: user?.avatarUrl || user?.avatar,
          hasUnseen: true,
          stories: [userStory],
        },
        ...storiesList,
      ]
    : storiesList;

  const handleOpenViewer = (index) => {
    setActiveStoryUserIndex(index);
    // Mark as seen
    if (storiesList[index]) {
      setStoriesList((prev) =>
        prev.map((s, idx) => (idx === index ? { ...s, hasUnseen: false } : s))
      );
    }
  };

  const handleSaveUserStory = (story) => {
    setUserStory(story);
  };

  return (
    <div className={cn("relative py-1", className)}>
      <div className="-mx-1 flex items-center gap-3.5 overflow-x-auto px-1 py-1 no-scrollbar">
        {/* Your Story Creator Bubble */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
          <button
            type="button"
            onClick={() => {
              if (userStory) {
                setActiveStoryUserIndex(0);
              } else {
                setIsCreateOpen(true);
              }
            }}
            className="group relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full p-0.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Add your campus story"
          >
            <div
              className={cn(
                "h-full w-full rounded-full p-0.5 transition-all",
                userStory
                  ? "bg-gradient-to-tr from-pink-500 via-amber-500 to-primary animate-pulse"
                  : "border-2 border-dashed border-primary/50 hover:border-primary"
              )}
            >
              <ClassroomAvatar
                avatar={user?.avatarUrl || user?.avatar}
                name={user?.name || "You"}
                size="h-full w-full"
              />
            </div>

            {/* Plus Icon Badge */}
            {!userStory && (
              <span className="absolute bottom-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-white ring-2 ring-surface shadow-xs">
                <Plus className="h-3 w-3 stroke-[3]" />
              </span>
            )}
          </button>
          <span className="text-[11px] font-medium text-text-heading truncate max-w-[62px]">
            {userStory ? "Your Story" : "Add Story"}
          </span>
        </div>

        {/* Community Campus Stories */}
        {storiesList.map((storyGroup, idx) => {
          const effectiveIndex = userStory ? idx + 1 : idx;

          return (
            <div
              key={storyGroup.id}
              className="flex flex-col items-center gap-1.5 shrink-0 select-none"
            >
              <button
                type="button"
                onClick={() => handleOpenViewer(effectiveIndex)}
                className="group relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full p-0.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                aria-label={`${storyGroup.authorName}'s story`}
              >
                <div
                  className={cn(
                    "h-full w-full rounded-full p-0.5 transition-all",
                    storyGroup.hasUnseen
                      ? "bg-gradient-to-tr from-pink-500 via-amber-500 to-primary p-0.7"
                      : "border border-border/80 bg-canvas"
                  )}
                >
                  <div className="h-full w-full rounded-full overflow-hidden ring-1 ring-surface">
                    <img
                      src={storyGroup.avatar}
                      alt={storyGroup.authorName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>
              <span className="text-[11px] font-medium text-text-muted group-hover:text-text-heading truncate max-w-[62px]">
                {storyGroup.authorName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Fullscreen Viewer */}
      <StoryViewerModal
        isOpen={activeStoryUserIndex !== null}
        userStories={allStoryGroups}
        initialUserIndex={activeStoryUserIndex || 0}
        onClose={() => setActiveStoryUserIndex(null)}
      />

      {/* Story Creator Modal */}
      <CreateStoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSaveStory={handleSaveUserStory}
      />
    </div>
  );
}

export default CampusStoriesBar;
