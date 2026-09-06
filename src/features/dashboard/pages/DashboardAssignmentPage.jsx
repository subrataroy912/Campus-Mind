import { useMemo, useState } from "react";
import { CheckCircle2, Circle, ClipboardList, FlaskConical, Users2 } from "lucide-react";

import { useDashboardData } from "../useDashboardData.js";
import { useAssignments } from "../hooks/useAssignments.js";
import EmptyState from "@/components/common/EmptyState.jsx";
import { Button } from "@/components/ui/button.jsx";

const TYPE_ICON = {
  quiz: ClipboardList,
  assignment: ClipboardList,
  project: Users2,
  homework: FlaskConical,
};

const STATUS_META = {
  "due-soon": { label: "Due soon", className: "bg-primary/10 text-primary" },
  upcoming: { label: "Upcoming", className: "bg-canvas text-text-main" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
};
const EMPTY_ITEMS = [];

function AssignmentCard({ item, onToggleComplete }) {
  const Icon = TYPE_ICON[item.type] || ClipboardList;
  const isCompleted = item.status === "completed";
  const meta = STATUS_META[item.status];

  return (
    <li className="group flex items-start gap-3 rounded-xl bg-surface p-4 shadow-sm ring-1 ring-border transition hover:shadow-md sm:p-5">
      <button
        onClick={() => onToggleComplete(item.id)}
        className="mt-0.5 shrink-0 text-text-muted transition hover:text-primary"
        aria-label={isCompleted ? "Mark as not done" : "Mark as done"}
      >
        {isCompleted ? (
          <CheckCircle2 size={22} className="text-success" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
            {meta.label}
          </span>
          <span className="truncate text-xs text-text-muted">{item.classroom}</span>
        </div>
        <h3 className={`flex items-center gap-2 text-sm font-medium sm:text-base ${isCompleted ? "text-text-muted line-through" : "text-text-heading"}`}>
          <Icon size={16} className="shrink-0 text-text-muted" aria-hidden="true" />
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-text-muted">{item.detail}</p>
        <p className="mt-1.5 text-xs font-medium text-text-muted">{item.due}</p>
      </div>
    </li>
  );
}

export default function DashboardAssignmentPage() {
  const { classrooms = [] } = useDashboardData();
  const { data, isLoading, error } = useAssignments();
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState(null);

  const assignmentItems = items ?? data?.items ?? EMPTY_ITEMS;
  const assignmentFilters = data?.filters ?? EMPTY_ITEMS;

  const toggleComplete = (id) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "completed" ? "upcoming" : "completed" }
          : item,
      ),
    );
  };

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return assignmentItems;
    return assignmentItems.filter((item) => item.status === activeFilter);
  }, [assignmentItems, activeFilter]);

  const dueSoonCount = assignmentItems.filter((item) => item.status === "due-soon").length;
  const hasClasses = classrooms.length > 0;

  if (isLoading) {
    return <div className="grid min-h-64 place-items-center text-sm text-text-muted">Loading assignments…</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <EmptyState
          title="We could not load assignments"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-3 sm:p-6">
      <header>
        <p className="text-sm font-semibold text-primary">Assignments</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">
          A clearer view of your work.
        </h1>
        <p className="mt-2 text-text-muted">
          {hasClasses && dueSoonCount > 0
            ? `You have ${dueSoonCount} item${dueSoonCount === 1 ? "" : "s"} due soon across your classes.`
            : "Assignments will show here when they are shared in one of your classes."}
        </p>
      </header>

      {!hasClasses ? (
        <div className="mt-8">
          <EmptyState
            title="No assignments due right now"
            description="Enjoy the breathing room, or check a class for its latest resources."
            action={{ to: "/dashboard", label: "View my classes" }}
          />
        </div>
      ) : (
        <>
          <div className="-mx-1 mt-6 flex max-w-full gap-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter assignments">
            {assignmentFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                role="tab"
                aria-selected={activeFilter === filter.id}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="mt-5">
            {filteredItems.length > 0 ? (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <AssignmentCard key={item.id} item={item} onToggleComplete={toggleComplete} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Nothing in this filter"
                description="Switch filters to see the rest of your work."
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
