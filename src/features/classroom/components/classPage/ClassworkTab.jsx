import { useMemo, useState } from "react";
import { ClipboardList, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  useGetCourseworkListQuery,
  useCreateCourseworkMutation,
} from "../../api/courseworkApi.js";
import { CourseworkCard } from "./CourseworkCard.jsx";
import { UpcomingPanel } from "./UpcomingPanel.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";

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
  const [createType, setCreateType] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formPoints, setFormPoints] = useState("100");
  const [createError, setCreateError] = useState("");

  const [createCoursework, { isLoading: isCreating }] = useCreateCourseworkMutation();

  const handleCloseDialog = () => {
    setCreateType(null);
    setFormTitle("");
    setFormDescription("");
    setFormDueDate("");
    setFormPoints("100");
    setCreateError("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setCreateError("Title is required");
      return;
    }
    setCreateError("");
    const payload = {
      type: createType,
      title: formTitle.trim(),
      description: formDescription.trim(),
    };
    if (createType === "ASSIGNMENT") {
      if (formDueDate) {
        payload.dueAt = new Date(formDueDate).toISOString();
      }
      if (formPoints) {
        payload.maximumPoints = Number(formPoints) || 100;
      }
    }
    try {
      await createCoursework({ courseId: classId, payload }).unwrap();
      handleCloseDialog();
    } catch (err) {
      setCreateError(
        err?.data?.message || err?.data?.error || "Failed to create coursework"
      );
    }
  };

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
                  {[
                    { label: "Assignment", type: "ASSIGNMENT" },
                    { label: "Material", type: "MATERIAL" },
                  ].map(({ label, type }) => (
                    <Button
                      key={type}
                      variant="ghost"
                      className="w-full justify-start text-xs font-medium rounded-lg"
                      onClick={() => {
                        setCreateType(type);
                        setCreateOpen(false);
                      }}
                    >
                      {label}
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
            description="Assignments and learning materials will appear here when assigned."
            action={
              teacher
                ? {
                    label: "Create your first assignment",
                    onClick: () => setCreateType("ASSIGNMENT"),
                  }
                : undefined
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

      {createType && (
        <Dialog
          open={Boolean(createType)}
          onOpenChange={(open) => !open && handleCloseDialog()}
        >
          <DialogContent className="max-w-lg bg-surface p-6">
            <DialogHeader>
              <DialogTitle>
                Create {createType === "ASSIGNMENT" ? "Assignment" : "Material"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              {createError && (
                <p className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  {createError}
                </p>
              )}
              <div>
                <label className="block text-xs font-medium text-text-heading mb-1">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={
                    createType === "ASSIGNMENT"
                      ? "e.g. Problem Set 1"
                      : "e.g. Week 1 Lecture Slides"
                  }
                  className="w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-heading mb-1">
                  {createType === "ASSIGNMENT" ? "Instructions" : "Description"}
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={
                    createType === "ASSIGNMENT"
                      ? "Describe instructions or questions…"
                      : "Add notes or resource details…"
                  }
                  className="w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                />
              </div>

              {createType === "ASSIGNMENT" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-heading mb-1">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-heading mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formPoints}
                      onChange={(e) => setFormPoints(e.target.value)}
                      placeholder="100"
                      className="w-full rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isCreating}
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isCreating}>
                  Publish
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

