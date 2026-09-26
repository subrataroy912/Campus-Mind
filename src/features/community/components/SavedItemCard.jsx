import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function SavedItemCard({ item, typeMeta, onUnsave }) {
  return (
    <li className="group rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                typeMeta?.color,
              )}
            >
              {typeMeta?.label ?? item.type}
            </Badge>
            <span className="truncate text-xs text-muted-foreground">
              {item.meta}
            </span>
          </div>
          <h3 className="text-sm font-medium text-foreground sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.snippet}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onUnsave(item.id)}
          aria-label="Remove from saved"
          title="Remove from saved"
          className="shrink-0 text-primary hover:bg-muted"
        >
          <Bookmark className="h-5 w-5 fill-current" />
        </Button>
      </div>
    </li>
  );
}
