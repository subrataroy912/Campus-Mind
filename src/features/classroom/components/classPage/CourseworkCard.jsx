import React, { useState } from "react";
import {
  ClipboardList,
  FileText,
  FlaskConical,
  Paperclip,
} from "lucide-react";
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
};

const statusLabel = {
  assigned: "Assigned",
  "due-soon": "Due soon",
  missing: "Missing",
  done: "Done",
};

const typeIcon = {
  assignment: ClipboardList,
  quiz: FlaskConical,
  material: FileText,
};

function StatusChip({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        statusClass[status] || statusClass.assigned
      }`}
    >
      {statusLabel[status] || "Assigned"}
    </span>
  );
}

export const CourseworkCard = React.memo(function CourseworkCard({
  item,
  classId,
  teacher,
  isHydrating,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);

  // Queries only run when item is expanded
  const { data: detailItem } = useGetCourseworkByIdQuery(
    { courseId: classId, courseworkId: item.id },
    { skip: isHydrating || !classId || !item.id || !isOpen }
  );

  const currentItem = detailItem || item;
  const itemType = (currentItem.type || "assignment").toLowerCase();
  const Icon = typeIcon[itemType] ?? ClipboardList;

  const allAttachments = [
    ...(currentItem.attachments || []),
    ...uploadedAttachments,
  ];

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-canvas/60"
        aria-expanded={isOpen}
      >
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-text-heading truncate">
            {currentItem.title}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{currentItem.dueDate}</p>
        </div>
        <StatusChip status={currentItem.status} />
      </button>

      {isOpen && (
        <div className="border-t border-border bg-canvas/40 px-4 py-4 space-y-4 transition-all">
          <p className="text-sm leading-relaxed text-text-main whitespace-pre-line">
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

          {teacher ? (
            <CourseworkGradingSection
              item={currentItem}
              classId={classId}
              isHydrating={isHydrating}
              isOpen={isOpen}
            />
          ) : (
            <CourseworkSubmissionSection
              classId={classId}
              item={currentItem}
              uploadedAttachments={uploadedAttachments}
              setUploadedAttachments={setUploadedAttachments}
            />
          )}

          <CourseworkCommentSection
            courseId={classId}
            courseworkId={item.id}
          />
        </div>
      )}
    </div>
  );
});
