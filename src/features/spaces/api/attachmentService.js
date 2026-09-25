import { IMAGE_PROFILES, optimizeImage } from "@/utils/optimizeImage.js";

export async function prepareAttachmentFile(file, resourceType = "COURSEWORK") {
  if (!file || typeof file.type !== "string" || !file.type.startsWith("image/")) {
    return file;
  }
  const normalizedType = String(resourceType || file.resourceType || "COURSEWORK").toUpperCase();
  const profile =
    normalizedType === "POST" || normalizedType === "STREAM" || normalizedType === "MESSAGE"
      ? IMAGE_PROFILES.FEED_ATTACHMENT
      : IMAGE_PROFILES.DOCUMENT_SCAN;
  return optimizeImage(file, profile);
}

export function buildUploadRequestBody(file = {}) {
  return {
    resourceType: file.resourceType ?? "COURSEWORK",
    resourceId: file.resourceId ?? "",
    originalFilename: file.name ?? file.fileName ?? "upload-file",
    contentType: file.type ?? file.fileType ?? "application/octet-stream",
    sizeBytes: file.size ?? file.contentLength ?? 0,
  };
}

export function normalizeAttachment(attachment = {}) {
  return {
    ...attachment,
    id: attachment.id ?? attachment.attachmentId,
    name: attachment.name ?? attachment.fileName ?? "Attachment",
    downloadUrl: attachment.downloadUrl ?? attachment.download_url ?? null,
    detail: attachment.detail ?? "File",
  };
}

export async function uploadAttachmentFile(uploadRequest, file) {
  const uploadUrl =
    uploadRequest?.uploadUrl ||
    uploadRequest?.url ||
    uploadRequest?.data?.uploadUrl;

  if (
    !uploadUrl ||
    !uploadRequest?.publicId ||
    !uploadRequest?.uploadApiKey ||
    !uploadRequest?.uploadSignature
  ) {
    throw new Error("The file upload service is not configured.");
  }

  const readyFile =
    file && typeof file.type === "string" && file.type.startsWith("image/")
      ? await prepareAttachmentFile(file, uploadRequest.resourceType)
      : file;

  const uploadForm = new FormData();
  uploadForm.append("file", readyFile);
  uploadForm.append("api_key", uploadRequest.uploadApiKey);
  uploadForm.append("timestamp", String(uploadRequest.uploadTimestamp));
  uploadForm.append("signature", uploadRequest.uploadSignature);
  uploadForm.append("public_id", uploadRequest.publicId);

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: uploadForm,
  });

  if (!uploadResponse.ok) {
    throw new Error("Cloudinary upload failed.");
  }

  return uploadResponse.json().catch(() => ({}));
}
