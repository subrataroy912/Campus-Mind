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
