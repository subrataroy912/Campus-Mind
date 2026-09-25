import { describe, expect, it } from "vitest";
import {
  formatFileSize,
  IMAGE_PROFILES,
  MAX_RAW_IMAGE_BYTES,
  resolveOptimizationOptions,
} from "./optimizeImage.js";

describe("optimizeImage presets & helpers", () => {
  it("defines the 4 requiredCampus-Mind compression budgets and 20 MB raw limit", () => {
    expect(MAX_RAW_IMAGE_BYTES).toBe(20 * 1024 * 1024);

    expect(IMAGE_PROFILES.AVATAR).toMatchObject({
      maxWidth: 400,
      maxHeight: 400,
      maxBytes: 20 * 1024,
      cropSquare: true,
    });

    expect(IMAGE_PROFILES.FEED_ATTACHMENT).toMatchObject({
      maxWidth: 1200,
      maxHeight: 900,
      maxBytes: 150 * 1024,
      cropSquare: false,
    });

    expect(IMAGE_PROFILES.DOCUMENT_SCAN).toMatchObject({
      maxWidth: 2000,
      maxHeight: 1500,
      maxBytes: 400 * 1024,
      autoGrayscale: true,
    });

    expect(IMAGE_PROFILES.HERO_BANNER).toMatchObject({
      maxWidth: 1920,
      maxHeight: 1080,
      maxBytes: 250 * 1024,
    });
  });

  it("resolves named presets, options objects, and legacy numeric dimensions", () => {
    expect(resolveOptimizationOptions("AVATAR").maxBytes).toBe(20 * 1024);
    expect(resolveOptimizationOptions(IMAGE_PROFILES.HERO_BANNER).maxBytes).toBe(
      250 * 1024,
    );
    expect(resolveOptimizationOptions(400).cropSquare).toBe(true);
    expect(resolveOptimizationOptions(1600).maxBytes).toBe(250 * 1024);
  });

  it("formats byte sizes into human-readable KB/MB strings", () => {
    expect(formatFileSize(0)).toBe("0 KB");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(16 * 1024)).toBe("16 KB");
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.50 MB");
  });
});
