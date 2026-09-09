import { describe, expect, it } from "vitest";
import {
  buildUploadRequestBody,
  normalizeAttachment,
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
