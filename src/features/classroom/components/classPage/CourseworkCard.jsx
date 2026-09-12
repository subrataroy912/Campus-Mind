import React, { useRef, useState } from "react";
import {
  ClipboardList,
  FileText,
  FlaskConical,
  Paperclip,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment.jsx";
import {
  useGetCourseworkByIdQuery,
  useGetSubmissionListQuery,
  useGradeSubmissionMutation,
  useStartSubmissionMutation,
} from "../../api/courseworkApi.js";
import {
  useAddCourseworkCommentMutation,
  useAddSubmissionCommentMutation,
  useGetCourseworkCommentsQuery,
} from "../../api/commentApi.js";
import {
  useCompleteUploadMutation,
  useRequestUploadUrlMutation,
} from "../../api/attachmentApi.js";
import { buildUploadRequestBody } from "../../api/attachmentService.js";

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
  const [draftSubmission, setDraftSubmission] = useState("");
  const [commentText, setCommentText] = useState("");
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [gradingError, setGradingError] = useState("");
  const [commentError, setCommentError] = useState("");
  const fileInputRef = useRef(null);

  // Queries only run when item is expanded
  const { data: detailItem } = useGetCourseworkByIdQuery(
    { courseId: classId, courseworkId: item.id },
    { skip: isHydrating || !classId || !item.id || !isOpen }
  );

  const { data: courseworkComments = [] } = useGetCourseworkCommentsQuery(
    { courseId: classId, courseworkId: item.id },
    { skip: isHydrating || !classId || !item.id || !isOpen }
  );

  const { data: submissionPage } = useGetSubmissionListQuery(
    { courseworkId: item.id, page: 0, size: 20 },
    { skip: isHydrating || !classId || !item.id || !isOpen || !teacher }
  );

  const [startSubmission] = useStartSubmissionMutation();
  const [requestUploadUrl] = useRequestUploadUrlMutation();
  const [completeUpload] = useCompleteUploadMutation();
  const [gradeSubmission] = useGradeSubmissionMutation();
  const [addCourseworkComment] = useAddCourseworkCommentMutation();
  const [addSubmissionComment] = useAddSubmissionCommentMutation();

  const currentItem = detailItem || item;
  const Icon = typeIcon[currentItem.type] ?? ClipboardList;
  const submissionList = submissionPage?.content ?? [];

  const handleAttachmentUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !item?.id) return;

    setIsUploading(true);
    setSubmissionError("");

    try {
      const uploadRequest = await requestUploadUrl(
        buildUploadRequestBody({
          name: file.name,
          type: file.type,
          size: file.size,
          resourceId: item.id,
        })
      ).unwrap();

      const uploadUrl =
        uploadRequest.uploadUrl ||
        uploadRequest.url ||
        uploadRequest?.data?.uploadUrl;

      if (
        !uploadUrl ||
        !uploadRequest.publicId ||
        !uploadRequest.uploadApiKey ||
        !uploadRequest.uploadSignature
      ) {
        throw new Error("The file upload service is not configured.");
      }

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", uploadRequest.uploadApiKey);
      uploadForm.append("timestamp", String(uploadRequest.uploadTimestamp));
      uploadForm.append("signature", uploadRequest.uploadSignature);
      uploadForm.append("public_id", uploadRequest.publicId);
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadForm,
      });
      if (!uploadResponse.ok) throw new Error("Cloudinary upload failed.");

      const completedAttachment = await completeUpload({
        attachmentId:
          uploadRequest.id ??
          uploadRequest.attachmentId ??
          `attachment-${item.id}`,
        payload: {
          publicId: uploadRequest.publicId,
          sizeBytes: file.size,
        },
      }).unwrap();

      const attachment = completedAttachment?.id
        ? completedAttachment
        : {
            id:
              uploadRequest.id ??
              uploadRequest.attachmentId ??
              `${item.id}-${Date.now()}`,
            name: file.name,
            detail: `${(file.size / 1024).toFixed(1)} KB`,
            downloadUrl: uploadRequest.downloadUrl ?? null,
          };

      setUploadedAttachments((curr) => [...curr, attachment]);
    } catch (requestError) {
      setSubmissionError(
        requestError?.message || "Unable to upload this file right now."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!classId || !item?.id) return;
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      await startSubmission({
        courseworkId: item.id,
        payload: {
          content: draftSubmission,
          submitted: true,
          attachments: uploadedAttachments,
        },
      }).unwrap();
      setDraftSubmission("");
    } catch (requestError) {
      setSubmissionError(
        requestError?.message || "Unable to submit this assignment right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrade = async (submission) => {
    if (!item?.id || !submission?.id) return;
    const gradeValue = Number(
      gradeDrafts[submission.id] ?? submission.score ?? 0
    );
    setIsGrading(true);
    setGradingError("");

    try {
      await gradeSubmission({
        courseworkId: item.id,
        submissionId: submission.id,
        payload: {
          score: gradeValue,
          status: "graded",
        },
      }).unwrap();
      setGradeDrafts((curr) => ({ ...curr, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(
        requestError?.message || "Unable to grade this submission."
      );
    } finally {
      setIsGrading(false);
    }
  };

  const handleAddComment = async () => {
    const content = commentText.trim();
    if (!content || !classId || !item?.id) return;
    setCommentError("");

    try {
      await addCourseworkComment({
        courseId: classId,
        courseworkId: item.id,
        payload: { content },
      }).unwrap();
      setCommentText("");
    } catch (requestError) {
      setCommentError(requestError?.message || "Unable to post this comment.");
    }
  };

  const handleAddSubmissionFeedback = async (submission) => {
    const content = (feedbackDrafts[submission.id] ?? "").trim();
    if (!content || !submission?.id) return;

    try {
      await addSubmissionComment({
        submissionId: submission.id,
        payload: { content },
      }).unwrap();
      setFeedbackDrafts((curr) => ({ ...curr, [submission.id]: "" }));
    } catch (requestError) {
      setGradingError(requestError?.message || "Unable to send feedback.");
    }
  };

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
            /* Teacher View: Progress and Grading */
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                  {currentItem.submittedCount ?? 0} of{" "}
                  {currentItem.totalCount ?? 0} submitted
                </span>
                <span className="font-semibold">
                  {Math.round(
                    ((currentItem.submittedCount ?? 0) /
                      Math.max(currentItem.totalCount ?? 1, 1)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-success transition-all duration-300"
                  style={{
                    width: `${
                      ((currentItem.submittedCount ?? 0) /
                        Math.max(currentItem.totalCount ?? 1, 1)) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Submissions List for Teacher */}
              {submissionList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Student Submissions
                  </p>
                  {submissionList.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-xl border border-border bg-surface p-3 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-text-heading">
                          {submission.user?.name ?? "Student submission"}
                        </p>
                        <span className="text-xs text-text-muted capitalize">
                          {submission.status ?? "new"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            gradeDrafts[submission.id] ??
                            submission.score ??
                            ""
                          }
                          onChange={(e) =>
                            setGradeDrafts((curr) => ({
                              ...curr,
                              [submission.id]: e.target.value,
                            }))
                          }
                          className="w-24 rounded-lg border border-border bg-canvas px-3 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                          placeholder="Score"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleGrade(submission)}
                          disabled={isGrading}
                        >
                          Save grade
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          value={feedbackDrafts[submission.id] ?? ""}
                          onChange={(e) =>
                            setFeedbackDrafts((curr) => ({
                              ...curr,
                              [submission.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-lg border border-border bg-canvas px-3 py-1.5 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                          placeholder="Add feedback for student…"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSubmissionFeedback(submission)}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  ))}
                  {gradingError && (
                    <p className="text-xs text-secondary font-medium">
                      {gradingError}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Student View: Upload and Submit */
            <div className="space-y-3 pt-2 border-t border-border">
              <textarea
                value={draftSubmission}
                onChange={(e) => setDraftSubmission(e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-text-heading outline-none focus:ring-2 focus:ring-focus"
                rows="2"
                placeholder="Add a private note or submission details…"
              />
              {submissionError && (
                <p className="text-xs text-secondary font-medium">
                  {submissionError}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploading ? "Uploading…" : "Add file"}</span>
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting…" : "Turn In"}
                </Button>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="rounded-xl border border-border bg-surface p-3.5 space-y-3">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Class Discussion
            </p>
            {courseworkComments.length === 0 ? (
              <p className="text-xs text-text-muted">No comments yet.</p>
            ) : (
              <div className="space-y-2">
                {courseworkComments.map((comment) => (
                  <div
                    key={comment.id ?? `${item.id}-${comment.content}`}
                    className="rounded-lg bg-canvas px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-text-heading">
                      {comment.author?.name ?? "Teacher"}
                    </p>
                    <p className="mt-0.5 text-text-main">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs text-text-heading outline-none focus:ring-2 focus:ring-focus"
                placeholder="Add a class comment…"
              />
              <Button size="sm" onClick={handleAddComment}>
                Post
              </Button>
            </div>
            {commentError && (
              <p className="text-xs text-secondary font-medium">
                {commentError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
