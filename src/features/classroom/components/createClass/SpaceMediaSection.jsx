import { Camera, ImagePlus, X } from "lucide-react";
import { THEME_COLORS } from "../../model/createSpaceForm.js";
import { getClassTheme } from "../../utils/classTheme.js";

export function SpaceMediaSection({
  form,
  preview,
  logoPreview,
  update,
  handleImageUpload,
  handleLogoUpload,
  onRemoveCover,
  onRemoveLogo,
}) {
  const currentTheme = getClassTheme({ theme: form.theme });

  const handleRemoveCoverClick = () => {
    if (onRemoveCover) onRemoveCover();
    else update("coverImage", null);
  };

  const handleRemoveLogoClick = (e) => {
    e.stopPropagation();
    if (onRemoveLogo) onRemoveLogo();
    else update("logoImage", null);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Branding & Cover
      </label>

      {/* Banner with overlapping logo */}
      <div className="relative">
        <div
          className={`group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-border ${
            preview ? "bg-canvas" : currentTheme.gradientClass
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Cover preview"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-3 text-center text-sm font-bold tracking-tight text-white/90 drop-shadow-xs">
              {form.className?.trim() || "Space Preview"}
            </span>
          )}

          {/* Hover overlay for banner actions */}
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1.5 bg-black/0 text-[11px] font-medium text-transparent opacity-0 transition-all group-hover:bg-black/40 group-hover:text-white group-hover:opacity-100">
            <ImagePlus className="h-3.5 w-3.5" />
            <span>{preview ? "Change banner" : "Upload banner"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e);
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemoveCoverClick}
              className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Logo overlapping bottom-left of banner */}
        <div className="absolute -bottom-4 left-3">
          <label className="group/logo relative block h-11 w-11 cursor-pointer overflow-hidden rounded-lg border-2 border-surface bg-surface shadow-xs ring-1 ring-border">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-primary/10 text-xs font-bold text-primary">
                {form.className?.trim()?.slice(0, 2)?.toUpperCase() || "SP"}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover/logo:bg-black/40 group-hover/logo:opacity-100">
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleLogoUpload(e);
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>

          {logoPreview && (
            <button
              type="button"
              onClick={handleRemoveLogoClick}
              className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Theme swatches — only relevant while no custom banner is set */}
      <div className="flex items-center gap-2 pt-4 pl-1">
        {!preview && (
          <>
            <span className="text-[11px] font-medium text-text-muted">
              Accent:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {THEME_COLORS.map((c) => {
                const isSelected =
                  form.theme === c.value || form.theme === c.id;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => update("theme", c.value)}
                    className={`h-4 w-4 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                      c.swatchClass
                    } ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110"
                        : "ring-1 ring-border/80 opacity-80 hover:opacity-100"
                    }`}
                    style={
                      c.colorHex ? { backgroundColor: c.colorHex } : undefined
                    }
                    title={`${c.name} theme`}
                    aria-label={`Select ${c.name} theme`}
                    aria-pressed={isSelected}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
