import { useEffect, useRef, useState } from "react";
import {
  formatFileSize,
  MAX_RAW_IMAGE_BYTES,
  optimizeImage,
} from "@/utils/optimizeImage.js";

const VALID_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

export default function ImageUploader({
  currentImage,
  onChange,
  inputId,
  label,
  preset,
  maxSize = MAX_RAW_IMAGE_BYTES,
  maxDimension = 1200,
  sizeClass,
  helperText,
}) {
  const [preview, setPreview] = useState(currentImage || null);
  const [optimizedStats, setOptimizedStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const hasChanges = Boolean(preview) && preview !== (currentImage || null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = async (file) => {
    if (!VALID_TYPES.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WebP, or AVIF)");
      return;
    }
    const rawLimit = Math.max(maxSize || MAX_RAW_IMAGE_BYTES, MAX_RAW_IMAGE_BYTES);
    if (file.size > rawLimit) {
      setError(`Raw image must be less than ${Math.round(rawLimit / (1024 * 1024))} MB`);
      return;
    }

    setError("");
    setIsProcessing(true);
    try {
      const optimizedFile = await optimizeImage(file, preset || maxDimension);
      const previewUrl = URL.createObjectURL(optimizedFile);
      setPreview(previewUrl);
      setOptimizedStats({
        originalBytes: file.size,
        compressedBytes: optimizedFile.size,
      });
      onChange(previewUrl, optimizedFile);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    const safeCurrent = currentImage || null;
    setPreview(safeCurrent);
    setOptimizedStats(null);
    onChange(safeCurrent, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative">
      <div
        className={`relative ${sizeClass} overflow-hidden rounded-lg border bg-muted object-cover shadow-xs transition-all ${
          isDragging
            ? "border-primary ring-2 ring-primary/50"
            : "border-border"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground">
            No {label.toLowerCase()} yet
          </div>
        )}
        {hasChanges && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
              {optimizedStats
                ? `Optimized · ${formatFileSize(optimizedStats.compressedBytes)}`
                : "Updated"}
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="sr-only"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? "Optimizing…" : hasChanges ? `Change ${label}` : `Choose ${label}`}
        </button>
        {hasChanges && (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg border border-destructive/40 bg-card px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 cursor-pointer"
          >
            Remove
          </button>
        )}
        {optimizedStats && (
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            {formatFileSize(optimizedStats.originalBytes)} →{" "}
            {formatFileSize(optimizedStats.compressedBytes)} WebP
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive font-medium" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
    </div>
  );
}
