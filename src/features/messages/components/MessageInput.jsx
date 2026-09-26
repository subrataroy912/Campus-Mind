import { useEffect, useRef } from "react";
import { ImagePlus, Loader2, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageImagePreview } from "./MessageImagePreview.jsx";
import { MessageAttachmentDrawer } from "./MessageAttachmentDrawer.jsx";

const MAX_MESSAGE_LENGTH = 2000;

export function MessageInput({
  draft,
  onDraftChange,
  roomTitle,
  selectedImageFile,
  selectedImagePreview,
  imageUploadError,
  isUploadingImage,
  showAttachmentInput,
  setShowAttachmentInput,
  attachmentUrl,
  onAttachmentUrlChange,
  attachmentName,
  onAttachmentNameChange,
  sendCooldownLeftMs = 0,
  onSend,
  onImageFileSelect,
  onClearImageFile,
  onPaste,
  notifyTyping,
}) {
  const composerTextareaRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const el = composerTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 128);
    el.style.height = `${Math.max(34, nextHeight)}px`;
  }, [draft]);

  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    onDraftChange(val);
    if (val.trim()) {
      notifyTyping?.();
    }
  };

  const handleComposerKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent?.isComposing &&
      (typeof window === "undefined" || window.innerWidth >= 640)
    ) {
      e.preventDefault();
      onSend(e);
    }
  };

  const isSendDisabled =
    isUploadingImage ||
    sendCooldownLeftMs > 0 ||
    (!draft.trim() && !attachmentUrl.trim() && !selectedImageFile);

  return (
    <div className="flex flex-col border-t border-border/70 bg-surface">
      {/* Selected Image Preview Drawer */}
      <MessageImagePreview
        preview={selectedImagePreview}
        file={selectedImageFile}
        error={imageUploadError}
        isUploading={isUploadingImage}
        onClear={onClearImageFile}
      />

      {/* Optional Attachment Input Drawer */}
      <MessageAttachmentDrawer
        isOpen={showAttachmentInput}
        url={attachmentUrl}
        onUrlChange={onAttachmentUrlChange}
        name={attachmentName}
        onNameChange={onAttachmentNameChange}
        onClose={() => {
          setShowAttachmentInput(false);
          onAttachmentUrlChange("");
          onAttachmentNameChange("");
        }}
      />

      {/* Message Composer Form */}
      <form onSubmit={onSend} className="flex items-end gap-2 p-2.5">
        <Input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onImageFileSelect}
          className="sr-only"
          tabIndex={-1}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploadingImage}
          title="Upload image"
          aria-label="Upload image"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border transition cursor-pointer disabled:opacity-50 ${
            selectedImageFile
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <ImagePlus size={15} />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowAttachmentInput((prev) => !prev)}
          title="Attach link or media URL"
          aria-label="Attach link or media URL"
          className={`inline-flex h-9 w-9 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border transition cursor-pointer ${
            showAttachmentInput
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/70 bg-canvas text-text-muted hover:text-text-heading"
          }`}
        >
          <Plus size={15} />
        </Button>

        <div className="relative flex-1 min-w-0">
          <Textarea
            ref={composerTextareaRef}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            value={draft}
            onChange={handleInputChange}
            onKeyDown={handleComposerKeyDown}
            onPaste={onPaste}
            placeholder={`Message ${roomTitle || "space"}…`}
            className="block w-full min-h-[34px] max-h-32 resize-none overflow-y-auto rounded-md border border-border/70 bg-canvas px-3 py-1.5 text-base sm:text-xs leading-relaxed text-text-heading placeholder:text-text-muted"
          />
          {draft.length >= 1500 && (
            <span
              className={`pointer-events-none absolute bottom-1 right-2 rounded bg-surface/90 px-1 text-[10px] font-medium tabular-nums ${
                draft.length >= MAX_MESSAGE_LENGTH
                  ? "text-destructive"
                  : "text-text-muted"
              }`}
            >
              {draft.length}/{MAX_MESSAGE_LENGTH}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={isSendDisabled}
          title={
            sendCooldownLeftMs > 0
              ? `Wait ${(sendCooldownLeftMs / 1000).toFixed(1)}s before sending next message`
              : "Send message (Enter)"
          }
          aria-label="Send message"
          className="min-h-9 min-w-9 sm:h-8 sm:w-8 shrink-0 px-1.5"
        >
          {isUploadingImage ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : sendCooldownLeftMs > 0 ? (
            <span className="text-[10px] font-semibold tabular-nums">
              {(sendCooldownLeftMs / 1000).toFixed(1)}s
            </span>
          ) : (
            <Send size={13} aria-hidden="true" />
          )}
        </Button>
      </form>
    </div>
  );
}
