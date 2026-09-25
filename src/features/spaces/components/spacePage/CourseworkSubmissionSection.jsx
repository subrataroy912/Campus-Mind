import { useRef, useState } from "react";
import { Upload, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import {
  useStartSubmissionMutation,
  useGetMySubmissionQuery,
  useSaveSubmissionMutation,
} from "../../api/courseworkApi.js";
import {
  useCompleteUploadMutation,
  useRequestUploadUrlMutation,
} from "../../api/attachmentApi.js";
import {
  buildUploadRequestBody,
  uploadAttachmentFile,
} from "../../api/attachmentService.js";
import { parseApiError } from "@/lib/errorUtils.js";

export function CourseworkSubmissionSection({ item }) {
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [draftSubmission, setDraftSubmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const fileInputRef = useRef(null);

  const { data: mySubmission, isLoading: isLoadingMySubmission } =
    useGetMySubmissionQuery(
      { courseworkId: item?.id },
      { skip: !item?.id },
    );

  const [startSubmission] = useStartSubmissionMutation();
  const [saveSubmission] = useSaveSubmissionMutation();
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
        parseApiError(requestError, "Unable to upload this file right now.").message
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const isTurnedIn = mySubmission?.status === "TURNED_IN" || mySubmission?.status === "GRADED";

  const handleSubmit = async () => {
    if (!item?.id) return;
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      if (!mySubmission) {
        await startSubmission({ courseworkId: item.id }).unwrap();
      }
      await saveSubmission({
        courseworkId: item.id,
        payload: {
          answerText: draftSubmission.trim(),
          status: "TURNED_IN",
        },
      }).unwrap();
      setDraftSubmission("");
    } catch (requestError) {
      setSubmissionError(
        parseApiError(requestError, "Unable to submit this assignment right now.").message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AsyncStateBoundary
      isLoading={isLoadingMySubmission}
      hasData={Boolean(mySubmission)}
      loadingFallback="spinner"
      compact
    >
      <div className="space-y-3 pt-2 border-t border-border">
        {mySubmission && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-canvas/70 px-3 py-2 text-xs border border-border">
          <div className="flex items-center gap-1.5 font-medium">
            {isTurnedIn ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <Clock className="h-4 w-4 text-amber-500" />
            )}
            <span className="text-text-heading font-semibold">
              Status: {mySubmission.status || "Assigned"}
            </span>
            {mySubmission.late && (
              <Badge variant="destructive" className="rounded-md px-1.5 py-0.5 text-[10px] font-bold h-auto">
                Late
              </Badge>
            )}
          </div>
          {mySubmission.score != null && (
            <div className="font-bold text-success">
              Grade: {mySubmission.score} / {item.maximumPoints || 100}
            </div>
          )}
        </div>
      )}
      <Textarea
        value={draftSubmission}
        onChange={(e) => setDraftSubmission(e.target.value)}
        className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-text-heading"
        rows={2}
        placeholder="Add a private note or submission details…"
      />
      {submissionError && (
        <p className="text-xs text-secondary font-medium">
          {submissionError}
        </p>
      )}

      {uploadedAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedAttachments.map((file, idx) => (
            <div
              key={file.id ?? `upload-${idx}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-canvas/80 px-2.5 py-1 text-xs text-text-heading shadow-2xs"
            >
              <Upload className="h-3 w-3 text-primary" />
              <span className="max-w-[160px] truncate">{file.name ?? "Attachment"}</span>
              {file.detail && <span className="text-text-muted text-[10px]">({file.detail})</span>}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div>
          <Input
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
          disabled={isSubmitting || isTurnedIn}
        >
          {isSubmitting ? "Submitting…" : isTurnedIn ? "Submitted" : "Turn In"}
        </Button>
      </div>
    </div>
    </AsyncStateBoundary>
  );
}
