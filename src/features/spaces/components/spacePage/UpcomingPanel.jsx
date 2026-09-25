import React from "react";
import { Calendar } from "lucide-react";

export const UpcomingPanel = React.memo(function UpcomingPanel({ items = [] }) {
  const upcomingItems = items.filter((x) => x.group !== "Past");

  return (
    <aside className="rounded-xl bg-card p-3 border border-border/70 shadow-2xs h-fit">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Calendar className="h-3.5 w-3.5 text-primary" />
        <h2 className="text-xs font-semibold text-foreground">
          Upcoming in this class
        </h2>
      </div>

      {upcomingItems.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-1">
          No work due in the near future.
        </p>
      ) : (
        <ul className="space-y-1">
          {upcomingItems.map((x) => (
            <li key={x.id} className="rounded-md p-1.5 transition-colors hover:bg-muted/50">
              <p className="text-xs font-medium text-foreground line-clamp-1">
                {x.title}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{x.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});
