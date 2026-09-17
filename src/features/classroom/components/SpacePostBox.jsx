import { useState, useRef } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  Megaphone,
  MessageSquare,
  Bookmark,
  Type,
  X,
  Image as ImageIcon,
  BarChart2,
} from "lucide-react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Input } from "@/components/ui/input.jsx";
import { CreatePollModal } from "./CreatePollModal.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { cn } from "@/lib/utils.js";

const POST_TYPES = [
  { id: "ANNOUNCEMENT", label: "Announcement", icon: Megaphone },
  { id: "DISCUSSION", label: "Discussion", icon: MessageSquare },
  { id: "MATERIAL", label: "Resource", icon: Bookmark },
];

export function SpacePostBox({
  onSubmit,
  isPosting = false,
  error = null,
  currentUser: userProp = null,
  placeholder = "Share an announcement, topic, or update with the space…",
  className = "",
}) {
  const { user: authUser } = useAuth();
  const currentUser = userProp || authUser;

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);
  const [postType, setPostType] = useState("ANNOUNCEMENT");
  const [localError, setLocalError] = useState("");

  // Rich attachments: Images & Polls
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedPoll, setAttachedPoll] = useState(null);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setAttachedImages((prev) => [...prev, ...newImages].slice(0, 4));
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !attachedPoll && attachedImages.length === 0) || isPosting) return;

    setLocalError("");
    const trimmedText = text.trim();
    const finalTitle =
      title.trim() ||
      (postType === "ANNOUNCEMENT"
        ? "Announcement"
        : postType === "DISCUSSION"
          ? "Discussion"
          : "Resource Update");

    const payload = {
      title: finalTitle,
      content: trimmedText,
      description: trimmedText,
      type: postType,
      text: trimmedText,
      poll: attachedPoll || undefined,
      media: attachedImages.length > 0 ? attachedImages.map((img) => ({ url: img.url, alt: img.name })) : undefined,
      toString() {
        return this.content;
      },
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      }
      setText("");
      setTitle("");
      setShowTitle(false);
      setAttachedImages([]);
      setAttachedPoll(null);
      setLocalError("");
    } catch (err) {
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to publish post. Please check your connection and try again.";
      setLocalError(errMsg);
    }
  };

  const displayedError = error || localError;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-3.5 sm:p-4.5 shadow-xs transition-all",
        className,
      )}
    >
      <div className="flex gap-3">
        <ClassroomAvatar
          name={currentUser?.name || currentUser?.username || "You"}
          avatar={currentUser?.avatarUrl || currentUser?.avatar}
          userId={currentUser?.id || ""}
          size="h-9 w-9 sm:h-10 sm:w-10"
        />

        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Post Type Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {POST_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = postType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPostType(type.id)}
                  disabled={isPosting}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition cursor-pointer",
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                      : "bg-canvas text-text-muted hover:text-text-main border border-border/70 hover:border-border",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span>{type.label}</span>
                </button>
              );
            })}

            {!showTitle && (
              <button
                type="button"
                onClick={() => setShowTitle(true)}
                disabled={isPosting}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-text-muted hover:text-primary transition border border-dashed border-border hover:border-primary/40 cursor-pointer ml-auto"
                title="Add a headline title"
              >
                <Type className="h-3 w-3" />
                <span>Add Title</span>
              </button>
            )}
          </div>

          {/* Optional Title Input */}
          {showTitle && (
            <div className="relative">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPosting}
                placeholder="Post title (optional)…"
                className="h-8 text-xs sm:text-sm font-medium pr-7 bg-canvas/40"
              />
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setShowTitle(false);
                }}
                disabled={isPosting}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-0.5"
                title="Remove title"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Main Textarea */}
          <Textarea
            rows={showTitle ? 2 : 3}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (localError) setLocalError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                submit(e);
              }
            }}
            disabled={isPosting}
            placeholder={placeholder}
            className="w-full resize-none text-xs sm:text-sm bg-canvas/40 min-h-[70px] focus-visible:ring-primary"
          />

          {/* Attached Poll Preview */}
          {attachedPoll && (
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <BarChart2 className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-text-heading block truncate">
                    Poll: {attachedPoll.question}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {attachedPoll.options.length} options · {attachedPoll.duration}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedPoll(null)}
                className="rounded-md p-1 text-text-muted hover:bg-canvas hover:text-text-main transition cursor-pointer"
                title="Remove poll"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Attached Images Thumbnails */}
          {attachedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {attachedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative h-16 w-16 overflow-hidden rounded-xl border border-border shadow-xs"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-80 hover:opacity-100 transition cursor-pointer"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {displayedError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{displayedError}</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <div className="flex items-center gap-1">
              {/* Photo Upload Trigger */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting || attachedImages.length >= 4}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-text-muted hover:bg-canvas hover:text-text-main transition cursor-pointer disabled:opacity-50"
                title="Attach photos (max 4)"
              >
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Photo</span>
              </button>

              {/* Poll Trigger */}
              <button
                type="button"
                onClick={() => setIsPollModalOpen(true)}
                disabled={isPosting || Boolean(attachedPoll)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-text-muted hover:bg-canvas hover:text-text-main transition cursor-pointer disabled:opacity-50"
                title="Create a poll"
              >
                <BarChart2 className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Poll</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted hidden sm:inline">
                Press{" "}
                <kbd className="rounded border border-border bg-canvas px-1 py-0.5 text-[10px] font-mono">
                  Ctrl+Enter
                </kbd>
              </span>

              <Button
                type="button"
                onClick={submit}
                disabled={(!text.trim() && !attachedPoll && attachedImages.length === 0) || isPosting}
                size="sm"
                className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Publishing…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Poll Creation Modal */}
          <CreatePollModal
            isOpen={isPollModalOpen}
            onClose={() => setIsPollModalOpen(false)}
            onSavePoll={setAttachedPoll}
            initialPoll={attachedPoll}
          />
        </div>
      </div>
    </div>
  );
}

export const ClassPostBox = SpacePostBox;
export default SpacePostBox;
