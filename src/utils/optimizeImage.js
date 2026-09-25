export const MAX_RAW_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB raw input ceiling

export const IMAGE_PROFILES = Object.freeze({
  AVATAR: Object.freeze({
    preset: "AVATAR",
    maxWidth: 400,
    maxHeight: 400,
    maxBytes: 20 * 1024, // < 20 KB hard budget
    cropSquare: true,
    initialQuality: 0.78,
    minQuality: 0.3,
  }),
  FEED_ATTACHMENT: Object.freeze({
    preset: "FEED_ATTACHMENT",
    maxWidth: 1200,
    maxHeight: 900,
    maxBytes: 150 * 1024, // 80 KB – 150 KB budget
    cropSquare: false,
    initialQuality: 0.78,
    minQuality: 0.38,
  }),
  DOCUMENT_SCAN: Object.freeze({
    preset: "DOCUMENT_SCAN",
    maxWidth: 2000,
    maxHeight: 1500,
    maxBytes: 400 * 1024, // 200 KB – 400 KB high-detail budget
    cropSquare: false,
    autoGrayscale: true,
    initialQuality: 0.82,
    minQuality: 0.45,
  }),
  HERO_BANNER: Object.freeze({
    preset: "HERO_BANNER",
    maxWidth: 1920,
    maxHeight: 1080,
    maxBytes: 250 * 1024, // 150 KB – 250 KB budget
    cropSquare: false,
    initialQuality: 0.8,
    minQuality: 0.38,
  }),
});

export function formatFileSize(bytes) {
  const num = Number(bytes);
  if (!Number.isFinite(num) || num <= 0) return "0 KB";
  if (num < 1024) return `${num} B`;
  const kb = num / 1024;
  if (kb < 1024) {
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function resolveOptimizationOptions(maxDimensionOrOptions, qualityArg = 0.8) {
  if (typeof maxDimensionOrOptions === "string" && IMAGE_PROFILES[maxDimensionOrOptions]) {
    return { ...IMAGE_PROFILES[maxDimensionOrOptions] };
  }

  if (maxDimensionOrOptions && typeof maxDimensionOrOptions === "object") {
    const basePreset =
      maxDimensionOrOptions.preset && IMAGE_PROFILES[maxDimensionOrOptions.preset]
        ? IMAGE_PROFILES[maxDimensionOrOptions.preset]
        : {};
    const fallbackDim =
      maxDimensionOrOptions.maxDimension ||
      basePreset.maxWidth ||
      1200;
    return {
      ...basePreset,
      ...maxDimensionOrOptions,
      maxWidth: maxDimensionOrOptions.maxWidth || fallbackDim,
      maxHeight:
        maxDimensionOrOptions.maxHeight ||
        maxDimensionOrOptions.maxDimension ||
        basePreset.maxHeight ||
        fallbackDim,
      initialQuality:
        maxDimensionOrOptions.quality ??
        maxDimensionOrOptions.initialQuality ??
        basePreset.initialQuality ??
        qualityArg,
      minQuality:
        maxDimensionOrOptions.minQuality ??
        basePreset.minQuality ??
        0.35,
    };
  }

  const dim = Number(maxDimensionOrOptions) || 1200;
  // Auto-select matching profile when legacy numeric maxDimension is passed
  if (dim <= 512) {
    return {
      ...IMAGE_PROFILES.AVATAR,
      maxWidth: Math.min(400, dim),
      maxHeight: Math.min(400, dim),
    };
  }
  if (dim >= 1900) {
    return {
      ...IMAGE_PROFILES.DOCUMENT_SCAN,
      maxWidth: dim,
      maxHeight: Math.round(dim * 0.75),
    };
  }
  if (dim >= 1500) {
    return {
      ...IMAGE_PROFILES.HERO_BANNER,
    };
  }
  return {
    ...IMAGE_PROFILES.FEED_ATTACHMENT,
    maxWidth: dim,
    maxHeight: dim,
    initialQuality: qualityArg,
  };
}

function computeSourceCropAndTargetSize(imgWidth, imgHeight, options, scaleFactor = 1) {
  const safeW = Math.max(1, imgWidth);
  const safeH = Math.max(1, imgHeight);

  if (options.cropSquare) {
    const side = Math.min(safeW, safeH);
    const sx = Math.floor((safeW - side) / 2);
    const sy = Math.floor((safeH - side) / 2);
    const maxTarget = Math.min(options.maxWidth || 400, options.maxHeight || 400);
    const targetSide = Math.max(
      48,
      Math.round(Math.min(side, maxTarget) * scaleFactor),
    );
    return {
      sx,
      sy,
      sw: side,
      sh: side,
      tw: targetSide,
      th: targetSide,
    };
  }

  const maxLong = Math.max(options.maxWidth || 1200, options.maxHeight || 900);
  const maxShort = Math.min(options.maxWidth || 1200, options.maxHeight || 900);
  const imgLong = Math.max(safeW, safeH);
  const imgShort = Math.min(safeW, safeH);

  const baseScale = Math.min(1, maxLong / imgLong, maxShort / imgShort);
  const finalScale = baseScale * scaleFactor;

  return {
    sx: 0,
    sy: 0,
    sw: safeW,
    sh: safeH,
    tw: Math.max(48, Math.round(safeW * finalScale)),
    th: Math.max(48, Math.round(safeH * finalScale)),
  };
}

function applyDocumentGrayscaleIfEligible(ctx, width, height, forceGrayscale = false) {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const totalPixels = width * height;

    if (!forceGrayscale) {
      // Sample up to ~400 pixels across the canvas to detect if scan is mostly text/low-saturation
      const stride = Math.max(4, Math.floor(totalPixels / 400) * 4);
      let sampled = 0;
      let colorfulPixels = 0;
      for (let i = 0; i < data.length; i += stride) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        if (maxC - minC > 28) {
          colorfulPixels++;
        }
        sampled++;
      }
      if (sampled > 0 && colorfulPixels / sampled > 0.12) {
        return; // Contains meaningful color diagram/content; keep color
      }
    }

    for (let i = 0; i < data.length; i += 4) {
      const lum = Math.round(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
      );
      data[i] = lum;
      data[i + 1] = lum;
      data[i + 2] = lum;
    }
    ctx.putImageData(imageData, 0, 0);
  } catch {
    // Ignore cross-origin or canvas read errors gracefully
  }
}

function canvasToBlobAsync(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== "function") {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

export function optimizeImage(file, maxDimensionOrOptions, quality = 0.8) {
  if (!file || typeof file !== "object") {
    return Promise.resolve(file);
  }

  const options = resolveOptimizationOptions(maxDimensionOrOptions, quality);

  return new Promise((resolve) => {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = async () => {
      try {
        const maxBytes = options.maxBytes || null;
        const initialQuality = Math.min(0.92, Math.max(0.3, options.initialQuality ?? 0.78));
        const minQuality = Math.min(initialQuality, Math.max(0.22, options.minQuality ?? 0.32));

        let scaleFactor = 1;
        let bestBlob = null;

        for (let scalePass = 0; scalePass < 5; scalePass++) {
          const { sx, sy, sw, sh, tw, th } = computeSourceCropAndTargetSize(
            image.width,
            image.height,
            options,
            scaleFactor,
          );

          const canvas = document.createElement("canvas");
          canvas.width = tw;
          canvas.height = th;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(sourceUrl);
            resolve(file);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(image, sx, sy, sw, sh, 0, 0, tw, th);

          if (options.grayscale || options.autoGrayscale) {
            applyDocumentGrayscaleIfEligible(ctx, tw, th, Boolean(options.grayscale));
          }

          let currentQuality = initialQuality;
          while (currentQuality >= minQuality - 0.001) {
            const blob = await canvasToBlobAsync(canvas, "image/webp", currentQuality);
            if (!blob) break;

            bestBlob = blob;
            if (!maxBytes || blob.size <= maxBytes) {
              break;
            }
            currentQuality = Number((currentQuality - 0.08).toFixed(2));
          }

          if (!bestBlob || !maxBytes || bestBlob.size <= maxBytes) {
            break;
          }

          // Still over the byte ceiling after reaching minQuality: step down pixel dimensions
          scaleFactor *= 0.82;
        }

        URL.revokeObjectURL(sourceUrl);

        if (!bestBlob) {
          resolve(file);
          return;
        }

        const baseName = (file.name || "image").replace(/\.[^.]+$/, "");
        const optimizedFile = new File([bestBlob], `${baseName}.webp`, {
          type: "image/webp",
          lastModified: Date.now(),
        });

        resolve(optimizedFile);
      } catch {
        URL.revokeObjectURL(sourceUrl);
        resolve(file);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve(file);
    };

    image.src = sourceUrl;
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadCourseAssetWithFallback(
  file,
  requestUploadFn,
  presetOrOptions = IMAGE_PROFILES.HERO_BANNER,
) {
  const optimizedFile =
    file && presetOrOptions ? await optimizeImage(file, presetOrOptions) : file;

  try {
    const upload = await requestUploadFn();
    if (
      upload?.uploadUrl &&
      upload?.uploadApiKey &&
      upload?.uploadSignature &&
      upload?.publicId
    ) {
      const body = new FormData();
      body.append("file", optimizedFile);
      body.append("api_key", upload.uploadApiKey);
      body.append("timestamp", String(upload.uploadTimestamp));
      body.append("signature", upload.uploadSignature);
      body.append("public_id", upload.publicId);
      const res = await fetch(upload.uploadUrl, { method: "POST", body });
      if (res.ok) {
        const json = await res.json();
        if (json?.secure_url) {
          return json.secure_url;
        }
      }
    }
  } catch {
    // Fall back to base64 data URI so the backend uploads/stores it server-side
  }
  return fileToDataUrl(optimizedFile);
}
