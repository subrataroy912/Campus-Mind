import { useMemo, useState } from "react";
import { ClipboardList, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useGetCourseworkListQuery } from "../../api/courseworkApi.js";
import { CourseworkCard } from "./CourseworkCard.jsx";
import { UpcomingPanel } from "./UpcomingPanel.jsx";

const GROUPS = ["This week", "Upcoming", "Past"];

export function ClassworkTab({
  teacher,
  classId,
  classroom,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const { authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: courseworkPage,
    isLoading,
    error,
  } = useGetCourseworkListQuery(
    { courseId: classId, page: 0, size: 20 },
    {
      skip: isHydrating || !classId || !isEnrolled,
    }
  );

  const coursework = useMemo(
    () => courseworkPage?.content ?? [],
    [courseworkPage]
  );

  // Normalize coursework items once
  const items = useMemo(() => {
    return coursework.map((item) => {
      const dueAt = item.dueAt ?? item.dueDate ?? null;
      const itemStatus = item.status ?? (dueAt ? "assigned" : "done");
      const attachments = Array.isArray(item.attachments)
        ? item.attachments.map((file) =>
            typeof file === "string"
              ? { name: file, detail: "Attachment" }
              : file
          )
        : [];

      return {
        ...item,
        title: item.title ?? item.name,
        instructions: item.instructions ?? item.description ?? "",
        dueDate: item.dueDate ?? dueAt ?? "No due date",
        dueAt,
        status: itemStatus,
        attachments,
        submittedCount: item.submittedCount ?? item.submissionCount ?? 0,
        totalCount: item.totalCount ?? classroom?.memberCount ?? 0,
      };
    });
  }, [coursework, classroom?.memberCount]);

  // Memoize grouping so dates are not re-parsed on every render
  const groupedItems = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const result = {
      "This week": [],
      Upcoming: [],
      Past: [],
    };

    items.forEach((item) => {
      if (item?.temporalStatus) {
        if (item.temporalStatus === "THIS_WEEK") {
          result["This week"].push(item);
          return;
        }
        if (
          item.temporalStatus === "UPCOMING" ||
          item.temporalStatus === "NO_DUE_DATE"
        ) {
          result.Upcoming.push(item);
          return;
        }
        if (item.temporalStatus === "PAST") {
          result.Past.push(item);
          return;
        }
      }

      const due = item?.dueAt ? new Date(item.dueAt) : null;
      if (!due || isNaN(due.getTime())) {
        result.Upcoming.push(item);
        return;
      }

      if (due < now) {
        result.Past.push(item);
      } else if (due <= nextWeek) {
        result["This week"].push(item);
      } else {
        result.Upcoming.push(item);
      }
    });

    return result;
  }, [items]);

  if (!isEnrolled) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <ClipboardList className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-text-heading">
          Classwork is reserved for enrolled students
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
          Join this class to access assignments, view learning materials, and submit coursework.
        </p>
        {onJoin && (
          <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2 rounded-xl">
            <UserPlus className="h-4 w-4" />
            <span>Join Class</span>
          </Button>
        )}
      </div>
    );
  }

  if (isLoading && !coursework.length) {
    return (
      <div className="mt-4 rounded-2xl bg-surface p-8 text-center text-sm text-text-muted ring-1 ring-border shadow-xs">
        Loading classwork assignments…
      </div>
    );
  }

  if (error && !coursework.length) {
    return (
      <div className="mt-4 rounded-2xl bg-surface p-8 text-center text-sm text-text-muted ring-1 ring-border shadow-xs">
        Unable to load classwork at the moment.
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <main className="space-y-6">
        {teacher && (
          <div className="flex justify-end">
            <div className="relative">
              <Button onClick={() => setCreateOpen(!createOpen)} className="gap-2 rounded-xl">
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create</span>
              </Button>
              {createOpen && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl bg-surface p-1 shadow-lg ring-1 ring-border">
                  {["Assignment", "Quiz", "Material"].map((type) => (
                    <Button
                      key={type}
                      variant="ghost"
                      className="w-full justify-start text-xs font-medium rounded-lg"
                      onClick={() => setCreateOpen(false)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <EmptyState
            title="No classwork posted yet"
            description="Assignments, quizzes, and learning materials will appear here when assigned."
            action={
              teacher ? { label: "Create your first assignment" } : undefined
            }
          />
        ) : (
          GROUPS.map((group) => {
            const groupList = groupedItems[group] ?? [];
            if (!groupList.length) return null;

            return (
              <section key={group} className="space-y-3">
                <h2 className="text-base font-bold text-text-heading">
                  {group}
                </h2>
                <div className="overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-border divide-y divide-border">
                  {groupList.map((item) => (
                    <CourseworkCard
                      key={item.id}
                      item={item}
                      classId={classId}
                      teacher={teacher}
                      isHydrating={isHydrating}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <UpcomingPanel items={items} />
    </div>
  );
}
