import { describe, expect, it, vi } from "vitest";
import {
  buildUploadRequestBody,
  normalizeAttachment,
  uploadAttachmentFile,
} from "./attachmentService.js";

describe("buildUploadRequestBody", () => {
  it("maps a file input to the upload-url request contract", () => {
    expect(
      buildUploadRequestBody({
        name: "homework.pdf",
        type: "application/pdf",
        size: 1024,
        resourceId: "coursework-1",
      })
    ).toEqual({
      resourceType: "COURSEWORK",
      resourceId: "coursework-1",
      originalFilename: "homework.pdf",
      contentType: "application/pdf",
      sizeBytes: 1024,
    });
  });
});

describe("normalizeAttachment", () => {
  it("normalizes backend attachment metadata into a UI-friendly shape", () => {
    expect(
      normalizeAttachment({
        id: "attachment-1",
        name: "homework.pdf",
        downloadUrl: "https://example.com/homework.pdf",
      })
    ).toEqual({
      id: "attachment-1",
      name: "homework.pdf",
      downloadUrl: "https://example.com/homework.pdf",
      detail: "File",
    });
  });
});

describe("uploadAttachmentFile", () => {
  it("throws an error if upload configuration is missing", async () => {
    await expect(
      uploadAttachmentFile({}, new Blob(["test"], { type: "text/plain" }))
    ).rejects.toThrow("The file upload service is not configured.");
  });

  it("posts file to the provided uploadUrl with form fields", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ secure_url: "https://cloudinary.com/test.jpg" }),
    });
    vi.stubGlobal("fetch", fakeFetch);

    const uploadRequest = {
      uploadUrl: "https://api.cloudinary.com/upload",
      publicId: "pub-123",
      uploadApiKey: "key-123",
      uploadSignature: "sig-123",
      uploadTimestamp: 1700000000,
    };
    const file = new File(["test content"], "test.txt", { type: "text/plain" });

    const result = await uploadAttachmentFile(uploadRequest, file);
    expect(fakeFetch).toHaveBeenCalledWith("https://api.cloudinary.com/upload", expect.objectContaining({
      method: "POST",
    }));
    expect(result).toEqual({ secure_url: "https://cloudinary.com/test.jpg" });

    vi.unstubAllGlobals();
  });

  it("throws an error if upload response is not ok", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", fakeFetch);

    const uploadRequest = {
      uploadUrl: "https://api.cloudinary.com/upload",
      publicId: "pub-123",
      uploadApiKey: "key-123",
      uploadSignature: "sig-123",
      uploadTimestamp: 1700000000,
    };
    const file = new File(["test content"], "test.txt", { type: "text/plain" });

    await expect(uploadAttachmentFile(uploadRequest, file)).rejects.toThrow(
      "Cloudinary upload failed."
    );

    vi.unstubAllGlobals();
  });
});

