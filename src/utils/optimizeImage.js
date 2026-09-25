export function optimizeImage(file, maxDimension, quality = 0.82) {
  return new Promise((resolve) => {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(
        1,
        maxDimension / Math.max(image.width, image.height)
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(sourceUrl);
          if (!blob) {
            resolve(file);
            return;
          }
          resolve(
            new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            })
          );
        },
        "image/webp",
        quality
      );
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

export async function uploadCourseAssetWithFallback(file, requestUploadFn) {
  try {
    const upload = await requestUploadFn();
    if (
      upload?.uploadUrl &&
      upload?.uploadApiKey &&
      upload?.uploadSignature &&
      upload?.publicId
    ) {
      const body = new FormData();
      body.append("file", file);
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
  return fileToDataUrl(file);
}

