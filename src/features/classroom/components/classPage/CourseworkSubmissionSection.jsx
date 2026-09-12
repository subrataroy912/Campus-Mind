import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useStartSubmissionMutation } from "../../api/courseworkApi.js";
import {
  useCompleteUploadMutation,
  useRequestUploadUrlMutation,
} from "../../api/attachmentApi.js";
import {
  buildUploadRequestBody,
  uploadAttachmentFile,
} from "../../api/attachmentService.js";

export function CourseworkSubmissionSection({
  classId,
  item,
  uploadedAttachments,
  setUploadedAttachments,
}) {
  const [draftSubmission, setDraftSubmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const fileInputRef = useRef(null);

  const [startSubmission] = useStartSubmissionMutation();
  const [requestUploadUrl] = useRequestUploadUrlMutation();
  const [completeUpload] = useCompleteUploadMutation();

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

      await uploadAttachmentFile(uploadRequest, file);

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

  return (
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
  );
}
