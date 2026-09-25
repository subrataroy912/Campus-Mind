import React, { useState } from "react";
import {
  ClipboardList,
  FileText,
  FlaskConical,
  Paperclip,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  useUpdateCourseworkMutation,
  useDeleteCourseworkMutation,
} from "../../api/courseworkApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment.jsx";
import { useGetCourseworkByIdQuery } from "../../api/courseworkApi.js";
import { CourseworkCommentSection } from "./CourseworkCommentSection.jsx";
import { CourseworkSubmissionSection } from "./CourseworkSubmissionSection.jsx";
import { CourseworkGradingSection } from "./CourseworkGradingSection.jsx";

const statusClass = {
  assigned: "bg-canvas text-text-main border border-border",
  "due-soon": "bg-primary/10 text-primary border border-primary/20",
  missing: "bg-destructive/10 text-destructive border border-destructive/20",
  done: "bg-success/10 text-success border border-success/20",
  draft: "bg-muted text-text-muted border border-border",
};

const statusLabel = {
  assigned: "Assigned",
  "due-soon": "Due soon",
  missing: "Missing",
  done: "Done",
  draft: "Draft",
};

const typeIcon = {
  assignment: ClipboardList,
  quiz: FlaskConical,
  material: FileText,
};

function StatusChip({ uiStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        statusClass[uiStatus] || statusClass.assigned
      }`}
    >
      {statusLabel[uiStatus] || "Assigned"}
    </span>
  );
}

export const CourseworkCard = React.memo(function CourseworkCard({
  item,
  classId,
  isStaff = false,
  isHydrating,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateCoursework, { isLoading: isPublishing }] = useUpdateCourseworkMutation();
  const [deleteCoursework, { isLoading: isDeleting }] = useDeleteCourseworkMutation();

  const handlePublishDraft = async (e) => {
    e.stopPropagation();
    try {
      await updateCoursework({
        courseId: classId,
        courseworkId: item.id,
        changes: { status: "PUBLISHED" },
      }).unwrap();
      toast.add({
        title: "Assignment published",
        description: "This item is now visible to all space members.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Publish failed",
        description: parseApiError(err, "Failed to publish draft.").message,
        type: "error",
      });
    }
  };

  const handleDeleteItem = async (e) => {
    e.stopPropagation();
    try {
      await deleteCoursework({
        courseId: classId,
        courseworkId: item.id,
      }).unwrap();
      toast.add({
        title: "Item deleted",
        description: "The coursework has been removed.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Delete failed",
        description: parseApiError(err, "Failed to delete item.").message,
        type: "error",
      });
    }
  };

  // Fetch full detail only when expanded; skip for drafts on initial load too.
  const { data: detailItem } = useGetCourseworkByIdQuery(
    { courseId: classId, courseworkId: item.id },
    { skip: isHydrating || !classId || !item.id || !isOpen }
  );

  const currentItem = detailItem || item;
  const itemType = (currentItem.type || "assignment").toLowerCase();
  const Icon = typeIcon[itemType] ?? ClipboardList;
  const isDraft = currentItem.status === "DRAFT";

  const allAttachments = currentItem.attachments || [];

  // Prefer the pre-formatted string from ClassworkTab; fall back for detail pane.
  const dueDateLabel =
    currentItem.formattedDueDate ??
    (currentItem.dueAt
      ? (() => {
          const d = new Date(currentItem.dueAt);
          if (isNaN(d.getTime())) return null;
          const now = new Date();
          return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
            hour: "2-digit",
            minute: "2-digit",
          });
        })()
      : null);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted/40 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-ring select-none"
        aria-expanded={isOpen}
      >
        <div
          className={`grid h-7 w-7 place-items-center rounded-md shrink-0 ${
            isDraft
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs text-foreground truncate">
            {currentItem.title}
          </p>
          {dueDateLabel && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Due {dueDateLabel}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Draft badge & action for staff */}
          {isStaff && isDraft && (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Draft
              </span>
              <Button
                size="sm"
                onClick={handlePublishDraft}
                disabled={isPublishing}
                className="h-5.5 px-2 text-[10px] font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded cursor-pointer"
              >
                <Send className="h-2.5 w-2.5" />
                <span>{isPublishing ? "Publishing…" : "Publish Now"}</span>
              </Button>
            </div>
          )}
          <StatusChip uiStatus={currentItem.uiStatus ?? "assigned"} />
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border/50 bg-muted/20 px-3 py-3 space-y-3 transition-all">
          <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
            {currentItem.instructions ||
              currentItem.description ||
              "No detailed instructions available."}
          </p>

          {allAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {allAttachments.map((file, idx) => (
                <Attachment
                  key={file.id ?? `${item.id}-file-${idx}`}
                  size="sm"
                  className="border-border bg-surface shadow-2xs"
                >
                  <AttachmentMedia>
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>
                      {file.name ?? file.title ?? "Attachment"}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      {file.detail ?? file.size ?? "File"}
                    </AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              ))}
            </div>
          )}

          {isStaff ? (
            <CourseworkGradingSection
              item={currentItem}
              isOpen={isOpen}
            />
          ) : (
            <CourseworkSubmissionSection
              item={currentItem}
            />
          )}

          <CourseworkCommentSection
            courseId={classId}
            courseworkId={item.id}
          />

          {isStaff && (
            <div className="flex justify-end pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteItem}
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive/10 text-xs gap-1.5 h-7 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isDeleting ? "Deleting…" : "Delete Item"}</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

