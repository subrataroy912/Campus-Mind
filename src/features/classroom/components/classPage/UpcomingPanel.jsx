import React from "react";
import { Calendar } from "lucide-react";

export const UpcomingPanel = React.memo(function UpcomingPanel({ items = [] }) {
  const upcomingItems = items.filter((x) => x.group !== "Past");

  return (
    <aside className="rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border h-fit">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-text-heading">
          Upcoming in this class
        </h2>
      </div>

      {upcomingItems.length === 0 ? (
        <p className="text-xs text-text-muted py-2">
          No work due in the near future.
        </p>
      ) : (
        <ul className="space-y-3">
          {upcomingItems.map((x) => (
            <li key={x.id} className="rounded-lg p-2 transition-colors hover:bg-canvas/60">
              <p className="text-sm font-medium text-text-main line-clamp-1">
                {x.title}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">{x.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});
