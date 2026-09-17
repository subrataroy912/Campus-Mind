import { useState, useRef } from "react";
import { Sparkles, Image as ImageIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { cn } from "@/lib/utils.js";

const GRADIENT_PRESETS = [
  "bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500",
  "bg-gradient-to-tr from-purple-600 to-blue-500",
  "bg-gradient-to-tr from-emerald-500 to-teal-700",
  "bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500",
];

export function CreateStoryModal({ isOpen, onClose, onSaveStory }) {
  const [caption, setCaption] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim() && !imageUrl) return;

    const newStory = {
      id: `user-story-${Date.now()}`,
      mediaUrl: imageUrl || null,
      bgGradient: imageUrl ? null : selectedGradient,
      caption: caption.trim(),
      timeAgo: "Just now",
    };

    onSaveStory(newStory);
    onClose();
    setCaption("");
    setImageUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-heading">
                Create Campus Story Drop
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Share a 24-hour visual moment, club announcement, or study status.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {/* Live Preview Card */}
          <div
            className={cn(
              "relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl p-4 text-center text-white shadow-inner transition-all",
              imageUrl ? "bg-black" : selectedGradient
            )}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Story preview"
                  className="h-full w-full object-cover"
                />
                {caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2.5 text-xs font-semibold">
                    {caption}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <p className="text-base font-bold leading-snug drop-shadow-md">
                {caption.trim() || "Type your message or status drop…"}
              </p>
            )}
          </div>

          {/* Caption Input */}
          <div>
            <label className="text-xs font-semibold text-text-heading">
              Story Text / Caption
            </label>
            <Input
              type="text"
              placeholder="e.g. Study session in Room 302 starting now! ☕"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 h-9 text-xs sm:text-sm bg-canvas/50"
            />
          </div>

          {/* Style / Background Choice */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-muted mr-1">
                Color:
              </span>
              {GRADIENT_PRESETS.map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    setSelectedGradient(g);
                  }}
                  className={cn(
                    "h-6 w-6 rounded-full transition-transform cursor-pointer",
                    g,
                    selectedGradient === g && !imageUrl && "ring-2 ring-primary ring-offset-2 scale-110"
                  )}
                />
              ))}
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 gap-1.5 text-xs cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                <span>Upload Photo</span>
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!caption.trim() && !imageUrl}
              className="text-xs font-semibold cursor-pointer"
            >
              Share Story
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoryModal;
