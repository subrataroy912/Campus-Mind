import { Inbox } from "lucide-react";
import { Button } from "../ui/button.jsx";

export default function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/60 px-4 py-6 text-center sm:py-8">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/50">
        <Inbox className="h-4 w-4" aria-hidden="true" />
      </div>
      <h3 className="mt-2.5 text-xs font-semibold tracking-tight text-foreground sm:text-sm">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-normal">
          {description}
        </p>
      )}
      {action && (
        <Button
          to={action.to}
          onClick={action.onClick}
          size="sm"
          className="mt-3.5 h-7 px-3 text-xs"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
