const unwrapResponse = (response) => response?.data ?? response;

export function buildUploadRequestBody(file = {}) {
  return {
    fileName: file.name ?? file.fileName ?? "upload-file",
    fileType: file.type ?? file.fileType ?? "application/octet-stream",
    contentLength: file.size ?? file.contentLength ?? 0,
    folder: file.folder ?? "coursework",
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

export async function requestUploadUrl(request) {
  return unwrapResponse(request);
}

export async function completeUpload(attachmentId, payload = {}) {
  return unwrapResponse(payload);
}

export async function deleteAttachment(attachmentId) {
  return attachmentId;
}
