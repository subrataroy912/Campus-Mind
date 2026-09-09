import { describe, expect, it } from "vitest";
import { buildUploadRequestBody, normalizeAttachment } from "./attachmentService.js";

describe("buildUploadRequestBody", () => {
  it("maps a file input to the upload-url request contract", () => {
    expect(
      buildUploadRequestBody({
        name: "homework.pdf",
        type: "application/pdf",
        size: 1024,
      }),
    ).toEqual({
      fileName: "homework.pdf",
      fileType: "application/pdf",
      contentLength: 1024,
      folder: "coursework",
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
      }),
    ).toEqual({
      id: "attachment-1",
      name: "homework.pdf",
      downloadUrl: "https://example.com/homework.pdf",
      detail: "File",
    });
  });
});
