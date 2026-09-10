import { baseApi } from "@/app/baseApi.js";

const normalizeAttachment = (attachment = {}) => ({
  ...attachment,
  id: attachment.id ?? attachment.attachmentId,
  publicId: attachment.publicId ?? attachment.public_id ?? null,
  name: attachment.name ?? attachment.fileName ?? "Attachment",
  uploadUrl: attachment.uploadUrl ?? attachment.upload_url ?? null,
  downloadUrl: attachment.downloadUrl ?? attachment.download_url ?? null,
  fileType:
    attachment.fileType ?? attachment.mimeType ?? "application/octet-stream",
  detail: attachment.detail ?? "File",
});

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestUploadUrl: builder.mutation({
      query: (payload) => ({
        url: "/attachments/upload-url",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeAttachment(response?.data ?? response),
    }),
    completeUpload: builder.mutation({
      query: ({ attachmentId, payload = {} }) => ({
        url: `/attachments/${attachmentId}/complete`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) =>
        normalizeAttachment(response?.data ?? response),
    }),
    listAttachments: builder.query({
      query: ({ resourceId, resourceType }) => ({ url: "/attachments", params: { resourceId, resourceType } }),
      transformResponse: (response) => response.map(normalizeAttachment),
      providesTags: ["Attachments"],
    }),
    getDownloadUrl: builder.query({
      query: (attachmentId) => `/attachments/${attachmentId}/download-url`,
      transformResponse: normalizeAttachment,
    }),
    deleteAttachment: builder.mutation({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRequestUploadUrlMutation,
  useCompleteUploadMutation,
  useListAttachmentsQuery,
  useGetDownloadUrlQuery,
  useDeleteAttachmentMutation,
} = attachmentApi;
