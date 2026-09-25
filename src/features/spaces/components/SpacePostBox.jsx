import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { SpaceAvatar } from "./SpaceAvatar.jsx";
import { toast } from "@/components/ui/toast.jsx";
import {
  fileToDataUrl,
  IMAGE_PROFILES,
  MAX_RAW_IMAGE_BYTES,
  optimizeImage,
} from "@/utils/optimizeImage.js";
import { Image, Paperclip, Video, Link2, X, Plus, Upload } from "lucide-react";

export default function SpacePostBox({ onSubmit, isSubmitting = false }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isOptimizingAttachment, setIsOptimizingAttachment] = useState(false);

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState("IMAGE");

  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  const fileInputRef = useRef(null);

  const userAvatar = user?.avatarUrl || null;
  const userName = user?.name || user?.displayName || user?.firstName || "You";
  const userId = user?.id || null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const isVideoFile =
      file.type?.startsWith("video/") ||
      /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name || "");
    if (isVideoFile) {
      toast.add({
        title: "Video file uploads not supported",
        description:
          "Please share a YouTube or external video link instead of uploading a video file directly.",
        type: "error",
      });
      return;
    }

    const isImg = file.type?.startsWith("image/");
    if (isImg) {
      if (file.size > MAX_RAW_IMAGE_BYTES) {
        toast.add({
          title: "Image too large",
          description: "Please select an image smaller than 20 MB.",
          type: "error",
        });
        return;
      }
      setIsOptimizingAttachment(true);
      try {
        const optimizedFile = await optimizeImage(
          file,
          IMAGE_PROFILES.FEED_ATTACHMENT,
        );
        const dataUrl = await fileToDataUrl(optimizedFile);
        setAttachments((prev) => [
          ...prev,
          {
            type: "IMAGE",
            title: file.name,
            url: dataUrl,
            sizeBytes: optimizedFile.size,
          },
        ]);
        setActiveDrawer(null);
      } catch {
        toast.add({
          title: "Could not process image",
          description: "Please try another image file (JPEG, PNG, or WebP).",
          type: "error",
        });
      } finally {
        setIsOptimizingAttachment(false);
      }
      return;
    }

    // Document / non-video file limit (2 MB for inline attachments)
    if (file.size > 2 * 1024 * 1024) {
      toast.add({
        title: "File too large",
        description:
          "Please attach documents under 2 MB or share an external cloud link.",
        type: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setAttachments((prev) => [
          ...prev,
          {
            type: "FILE",
            title: file.name,
            url: dataUrl,
            sizeBytes: file.size,
          },
        ]);
      }
    };
    reader.readAsDataURL(file);
    setActiveDrawer(null);
  };

  const handleAddMediaUrl = (e) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;
    setAttachments((prev) => [
      ...prev,
      {
        type: mediaType,
        title:
          mediaTitle.trim() ||
          (mediaType === "IMAGE" ? "Image attachment" : "File attachment"),
        url: mediaUrl.trim(),
      },
    ]);
    setMediaUrl("");
    setMediaTitle("");
    setActiveDrawer(null);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const isVideo = /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm/i.test(
      linkUrl,
    );
    setAttachments((prev) => [
      ...prev,
      {
        type: isVideo ? "VIDEO" : "LINK",
        title: linkTitle.trim() || linkUrl.trim(),
        url: linkUrl.trim(),
      },
    ]);
    setLinkUrl("");
    setLinkTitle("");
    setActiveDrawer(null);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSubmit?.({
      text: text.trim(),
      attachments,
    });
    setText("");
    setAttachments([]);
    setActiveDrawer(null);
  };

  const hasContent = Boolean(text.trim() || attachments.length > 0);
  return (
    <div className="rounded-xl bg-card p-3 border border-border/70 shadow-2xs">
      <div className="flex gap-2.5">
        <SpaceAvatar
          name={userName}
          avatar={userAvatar}
          userId={userId}
          size="h-7 w-7"
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share an announcement or update with this space…"
            className="w-full resize-none rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-base sm:text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/50"
          />

          {/* Attachments preview chips */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-md bg-muted/70 border border-border/70 px-2 py-1 text-[11px] text-foreground"
                >
                  {att.type === "IMAGE" && (
                    <Image className="h-3 w-3 text-blue-500 shrink-0" />
                  )}
                  {att.type === "VIDEO" && (
                    <Video className="h-3 w-3 text-red-500 shrink-0" />
                  )}
                  {att.type === "FILE" && (
                    <Paperclip className="h-3 w-3 text-amber-500 shrink-0" />
                  )}
                  {att.type === "LINK" && (
                    <Link2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  )}
                  <span className="max-w-[160px] sm:max-w-[220px] truncate font-medium">
                    {att.title || att.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Inline Media Attachment Drawer */}
          {activeDrawer === "file" && (
            <div className="rounded-lg border border-border/70 bg-muted/40 p-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-[11px]">
                  Attach Image or File
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isOptimizingAttachment}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-foreground border border-border hover:bg-muted/80 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="h-3 w-3" />
                  {isOptimizingAttachment
                    ? "Optimizing image…"
                    : "Upload from computer"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.zip,.txt"
                />
                <span className="text-[10px] text-muted-foreground">
                  or use URL
                </span>
              </div>

              <form
                onSubmit={handleAddMediaUrl}
                className="flex flex-col sm:flex-row gap-1.5"
              >
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="rounded-md border border-border/60 bg-surface px-2 py-1 text-[11px] text-foreground outline-none"
                >
                  <option value="IMAGE">Image</option>
                  <option value="FILE">File / Doc</option>
                </select>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/file.png"
                  className="min-w-0 flex-1 rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full sm:w-36 rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
                <button
                  type="submit"
                  disabled={!mediaUrl.trim()}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50 cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          )}

          {/* Inline Link/Video Drawer */}
          {activeDrawer === "link" && (
            <div className="rounded-lg border border-border/70 bg-muted/40 p-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-[11px]">
                  Add Video or Web Link
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <form
                onSubmit={handleAddLink}
                className="flex flex-col sm:flex-row gap-1.5"
              >
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or website URL"
                  className="min-w-0 flex-1 rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="w-full sm:w-36 rounded-md border border-border/60 bg-surface px-2.5 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
                />
                <button
                  type="submit"
                  disabled={!linkUrl.trim()}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50 cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setActiveDrawer((prev) => (prev === "file" ? null : "file"))
            }
            className={`inline-flex min-h-8 sm:min-h-7 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeDrawer === "file"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Paperclip className="h-3.5 w-3.5" /> Attach
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveDrawer((prev) => (prev === "link" ? null : "link"))
            }
            className={`inline-flex min-h-8 sm:min-h-7 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              activeDrawer === "link"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Video / Link
          </button>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!hasContent || isSubmitting}
          className="inline-flex min-h-8 sm:min-h-7 items-center rounded-md bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-2xs transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
