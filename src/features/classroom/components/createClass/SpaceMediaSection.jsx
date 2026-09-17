import { useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  Loader2,
  Palette,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { CLASSROOM_THEMES, getClassTheme } from "../../utils/classTheme.js";
import { SPACE_TYPES } from "../../model/createSpaceForm.js";

const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

function getSpaceInitials(title = "") {
  const clean = title.trim();
  if (!clean) return "SP";
  const words = clean.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function SpaceMediaSection({
  form,
  preview,
  logoPreview,
  update,
  handleImageUpload,
  handleLogoUpload,
  onRemoveCover,
  onRemoveLogo,
  isUploadingCover = false,
  isUploadingLogo = false,
}) {
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [fileError, setFileError] = useState("");

  const currentTheme = getClassTheme({ theme: form.theme });
  const currentSpaceType = SPACE_TYPES.find((t) => t.id === form.spaceType);

  const showFileError = (msg) => {
    setFileError(msg);
    setTimeout(() => {
      setFileError("");
    }, 4000);
  };

  const handleBannerFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showFileError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > MAX_COVER_SIZE) {
      showFileError("Cover banner exceeds 5MB size limit.");
      return;
    }
    setFileError("");
    handleImageUpload(file);
  };

  const handleLogoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showFileError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      showFileError("Space logo exceeds 2MB size limit.");
      return;
    }
    setFileError("");
    handleLogoUpload(file);
  };

  const handleRemoveCoverClick = (e) => {
    e?.stopPropagation();
    if (onRemoveCover) onRemoveCover();
    else update("coverImage", null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const handleRemoveLogoClick = (e) => {
    e?.stopPropagation();
    if (onRemoveLogo) onRemoveLogo();
    else update("logoImage", null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Hidden File Inputs */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => {
          handleBannerFile(e.target.files?.[0]);
          e.target.value = "";
        }}
        className="sr-only"
        aria-label="Upload banner image"
      />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => {
          handleLogoFile(e.target.files?.[0]);
          e.target.value = "";
        }}
        className="sr-only"
        aria-label="Upload logo image"
      />

      {/* Section Header */}
      <div className="flex items-center gap-1.5">
        <div className="grid h-4.5 w-4.5 place-items-center rounded-md bg-primary/10 text-primary">
          <Palette className="h-3 w-3" />
        </div>
        <label className="text-xs font-semibold text-text-heading">
          Branding & Appearance
        </label>
      </div>

      {/* Inline File Validation Error */}
      {fileError && (
        <div
          className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-300"
          role="alert"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-[11px]">{fileError}</span>
          <button
            type="button"
            onClick={() => setFileError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Unified Compact Preview & Media Controller */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xs">
        {/* Banner with Direct Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingBanner(true);
          }}
          onDragLeave={() => setIsDraggingBanner(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingBanner(false);
            handleBannerFile(e.dataTransfer.files?.[0]);
          }}
          className={`group relative h-22 sm:h-26 w-full overflow-hidden transition-all ${
            preview ? "bg-canvas" : currentTheme.gradientClass
          } ${isDraggingBanner ? "ring-2 ring-primary ring-inset brightness-105" : ""}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Space banner preview"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-radial-[at_top_left]_from-white/20_via-transparent_to-black/30 pointer-events-none" />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

          {/* Uploading Banner Loading Overlay */}
          {isUploadingCover && (
            <div className="absolute inset-0 z-30 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-xs text-xs font-medium text-white">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Processing cover…</span>
            </div>
          )}

          {/* Drag & Drop Visual Cue */}
          {isDraggingBanner && !isUploadingCover && (
            <div className="absolute inset-0 z-30 flex items-center justify-center gap-1.5 bg-black/65 backdrop-blur-xs text-xs font-semibold text-white">
              <UploadCloud className="h-4 w-4 animate-bounce" />
              <span>Drop cover banner here</span>
            </div>
          )}

          {/* Banner Controls Bar */}
          <div className="absolute inset-x-2 top-2 z-20 flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-md border border-white/15">
              <Sparkles className="h-2.5 w-2.5 text-amber-300" />
              <span>{currentSpaceType?.badge || currentSpaceType?.label || "Space"}</span>
            </span>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isUploadingCover}
                onClick={() => bannerInputRef.current?.click()}
                className="h-6 px-2 text-[11px] font-medium bg-black/40 hover:bg-black/65 text-white border border-white/20 backdrop-blur-md shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isUploadingCover ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    <span>Uploading…</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-3 w-3 mr-1" />
                    <span>{preview ? "Change Cover" : "Add Cover"}</span>
                  </>
                )}
              </Button>

              {preview && !isUploadingCover && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleRemoveCoverClick}
                  title="Remove custom banner"
                  aria-label="Remove cover image"
                  className="h-6 w-6 p-0 bg-black/40 hover:bg-red-600/90 text-white border border-white/20 backdrop-blur-md shadow-xs transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Identity Row: Overlapping Avatar & Live Details */}
        <div className="relative px-3 sm:px-4 pb-2.5 pt-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Overlapping Avatar */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingLogo(true);
              }}
              onDragLeave={() => setIsDraggingLogo(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingLogo(false);
                handleLogoFile(e.dataTransfer.files?.[0]);
              }}
              className={`group/logo relative -mt-6 sm:-mt-7 h-13 w-13 sm:h-15 sm:w-15 shrink-0 overflow-hidden rounded-xl border-2 border-surface bg-surface shadow-xs ring-1 ring-border transition-all ${
                isDraggingLogo ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Space logo preview"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`grid h-full w-full place-items-center text-xs sm:text-sm font-bold text-white shadow-inner ${currentTheme.gradientClass}`}
                >
                  {getSpaceInitials(form.className || form.title)}
                </div>
              )}

              {/* Uploading Logo Loading Overlay */}
              {isUploadingLogo && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-white">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
              )}

              {/* Avatar Click/Tap Overlay */}
              {!isUploadingLogo && (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  aria-label={logoPreview ? "Change space logo" : "Upload space logo"}
                  title={logoPreview ? "Change logo" : "Upload logo"}
                  className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 group-hover/logo:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5 drop-shadow-xs" />
                </button>
              )}

              {logoPreview && !isUploadingLogo && (
                <button
                  type="button"
                  onClick={handleRemoveLogoClick}
                  aria-label="Remove space logo"
                  title="Remove logo"
                  className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <X className="h-2 w-2" />
                </button>
              )}
            </div>

            {/* Live Name & Subtitle Preview + Logo Actions */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-text-heading tracking-tight truncate">
                  {form.className?.trim() || form.title?.trim() || "Space Preview"}
                </h3>
                <p className="text-[11px] text-text-muted truncate">
                  {form.subject || "Domain / Subject"}
                  {form.section ? ` • ${form.section}` : ""}
                </p>
              </div>

              {/* Inline Quick Action for Logo */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                  className="h-6 px-2 text-[11px] text-text-muted hover:text-text-heading hover:bg-canvas border-border/70 disabled:opacity-60"
                >
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      <span>Uploading…</span>
                    </>
                  ) : (
                    <>
                      <Camera className="h-3 w-3 mr-1" />
                      <span>{logoPreview ? "Change Logo" : "Add Logo"}</span>
                    </>
                  )}
                </Button>
                {logoPreview && !isUploadingLogo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogoClick}
                    title="Remove custom logo"
                    className="h-6 w-6 p-0 text-text-muted hover:text-destructive hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Compact Single-line Theme Swatches */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-border/50 pt-2">
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-text-muted">Accent Theme:</span>
              <span className="font-semibold text-text-heading capitalize">
                {currentTheme.name}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Color themes"
              className="flex items-center gap-1.5"
            >
              {CLASSROOM_THEMES.map((theme) => {
                const isSelected = form.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => update("theme", theme.id)}
                    title={`${theme.name} theme`}
                    aria-label={`Select ${theme.name} theme`}
                    className={`h-4.5 w-4.5 rounded-full transition-transform hover:scale-110 cursor-pointer shadow-2xs ${theme.gradientClass} ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110"
                        : "opacity-75 hover:opacity-100 ring-1 ring-border/60"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
