import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/optimizeImage.js";

export function MessageImagePreview({
  preview,
  file,
  error,
  isUploading,
  onClear,
}) {
  if (!preview && !error) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-canvas/60 px-3 py-2">
      {preview ? (
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={preview}
            alt={file?.name || "Selected preview"}
            className="h-12 w-12 rounded-md border border-border/70 object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text-heading">
              {file?.name || "Image attached"}
            </p>
            {error ? (
              <p className="text-[11px] text-destructive">{error}</p>
            ) : (
              <p className="text-[11px] text-text-muted">
                {isUploading
                  ? "Optimizing & uploading image…"
                  : `Ready to send · ${formatFileSize(file?.size || 0)} WebP`}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onClear}
        disabled={isUploading}
        className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer disabled:opacity-50"
        aria-label="Remove selected image"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
