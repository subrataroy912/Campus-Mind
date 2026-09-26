import { Link2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MessageAttachmentDrawer({
  isOpen,
  url,
  onUrlChange,
  name,
  onNameChange,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border/70 bg-canvas/60 px-3 py-2">
      <Link2 className="h-3.5 w-3.5 text-text-muted shrink-0" />
      <Input
        type="url"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Paste attachment or image URL (https://…)"
        className="flex-1 min-w-44 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading"
      />
      <Input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Label (optional)"
        className="w-36 h-7 rounded border border-border/70 bg-surface px-2 text-xs text-text-heading"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onClose}
        className="rounded p-1 text-text-muted hover:text-text-heading cursor-pointer"
        aria-label="Close attachment input"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
