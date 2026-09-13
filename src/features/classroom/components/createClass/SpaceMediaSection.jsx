import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
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
    if (onRemoveCover) {
      onRemoveCover();
    } else {
      update("coverImage", null);
    }
  };

  const handleRemoveLogoClick = () => {
    if (onRemoveLogo) {
      onRemoveLogo();
    } else {
      update("logoImage", null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Branding & Cover
        </label>
        <p className="text-[12px] text-text-muted">
          Add an optional banner and icon to brand your space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Cover Banner (takes 2 cols on desktop) */}
        <div className="sm:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-text-main">
              Cover banner
            </span>
            {preview && (
              <button
                type="button"
                onClick={handleRemoveCoverClick}
                className="inline-flex items-center gap-1 text-[11px] text-text-muted transition-colors hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div
            className={`relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-border shadow-xs ${
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
              <div className="px-3 text-center">
                <span className="text-base font-bold tracking-tight text-white/90 drop-shadow-xs">
                  {form.className?.trim() || "Space Preview"}
                </span>
                {form.section?.trim() && (
                  <p className="text-[11px] font-medium text-white/70">
                    {form.section}
                  </p>
                )}
              </div>
            )}

            {/* Upload button trigger */}
            <label className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1 rounded-md border border-border/50 bg-surface/90 px-2 py-1 text-[11px] font-medium text-text-heading shadow-xs backdrop-blur-xs transition hover:bg-surface focus-within:ring-1 focus-within:ring-primary">
              <ImageIcon className="h-3 w-3 text-primary" />
              <span>{preview ? "Change" : "Upload banner"}</span>
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
          </div>

          {/* Color theme swatches */}
          {!preview && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-medium text-text-muted">
                Accent:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {THEME_COLORS.map((c) => {
                  const isSelected = form.theme === c.value || form.theme === c.id;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => update("theme", c.value)}
                      className={`h-5 w-5 rounded-full ring-offset-1 transition-transform hover:scale-110 cursor-pointer ${
                        c.swatchClass
                      } ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-surface scale-110 shadow-xs"
                          : "ring-1 ring-border/80 opacity-80 hover:opacity-100"
                      }`}
                      style={c.colorHex ? { backgroundColor: c.colorHex } : undefined}
                      title={`${c.name} theme`}
                      aria-label={`Select ${c.name} theme`}
                      aria-pressed={isSelected}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Logo / Avatar (takes 1 col on desktop) */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-canvas/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-main">
              Logo / Icon
            </span>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogoClick}
                className="inline-flex items-center gap-0.5 text-[11px] text-text-muted hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="my-2 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Class logo preview"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary/10 text-sm font-bold text-primary">
                  {form.className?.trim()?.slice(0, 2)?.toUpperCase() || "SP"}
                </div>
              )}
            </div>

            <p className="text-[11px] text-text-muted leading-tight">
              Square icon for cards and lists.
            </p>
          </div>

          <label className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-text-heading shadow-2xs transition hover:bg-canvas focus-within:ring-1 focus-within:ring-primary">
            <Camera className="h-3.5 w-3.5 text-primary" />
            <span>{logoPreview ? "Change icon" : "Upload icon"}</span>
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
        </div>
      </div>
    </div>
  );
}
