import { useRef, useState } from "react";

const VALID_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function ImageUploader({
  currentImage,
  onChange,
  inputId,
  label,
  maxSize,
  sizeClass,
  helperText,
}) {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const hasChanges = preview !== currentImage;

  const handleFileSelect = (file) => {
    if (!VALID_TYPES.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    if (file.size > maxSize) {
      setError(`Image size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(currentImage);
    onChange(currentImage);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative">
      <div
        className={`relative ${sizeClass} overflow-hidden rounded-lg border bg-gray-200 object-cover shadow-sm transition-all ${
          isDragging ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-200"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
        {hasChanges && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
              Updated
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
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
          disabled={hasChanges}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose {label}
        </button>
        {hasChanges && (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
      <p className="mt-2 text-xs text-gray-500">{helperText}</p>
    </div>
  );
}
