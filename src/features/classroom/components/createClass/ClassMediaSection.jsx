import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { THEME_COLORS } from "../../model/createClassForm.js";
import { getClassTheme } from "../../utils/classTheme.js";

export function ClassMediaSection({
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
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Branding & Media
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Add an optional cover banner and logo icon to give your class a
          recognizable identity.
        </p>
      </div>

      {/* Cover Banner */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-text-main">
            Class cover banner{" "}
            <span className="text-xs font-normal text-text-muted">
              (optional, 16:9 recommended)
            </span>
          </label>
          {preview && (
            <button
              type="button"
              onClick={handleRemoveCoverClick}
              className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove cover</span>
            </button>
          )}
        </div>

        <div
          className={`relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-border shadow-xs sm:h-44 ${
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
            <div className="px-4 text-center">
              <span className="text-lg font-bold tracking-tight text-white/90 drop-shadow-xs sm:text-2xl">
                {form.className?.trim() || "Your Class Title"}
              </span>
              {form.section?.trim() && (
                <p className="mt-0.5 text-xs font-medium text-white/70">
                  {form.section}
                </p>
              )}
            </div>
          )}

          {/* Accessible file input trigger */}
          <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/50 bg-surface/90 px-3 py-1.5 text-xs font-medium text-text-heading shadow-md backdrop-blur-xs transition hover:bg-surface focus-within:ring-2 focus-within:ring-primary">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span>{preview ? "Change cover" : "Upload cover image"}</span>
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

        {/* Fallback Theme Color Selection */}
        {!preview && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">
              Accent theme:
            </span>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map((c) => {
                const isSelected = form.theme === c.value || form.theme === c.id;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => update("theme", c.value)}
                    className={`h-6 w-6 rounded-full ring-offset-2 transition-transform hover:scale-110 cursor-pointer ${
                      c.swatchClass
                    } ${
                      isSelected
                        ? "ring-2 ring-primary ring-offset-surface scale-110 shadow-sm"
                        : "ring-1 ring-border/80 opacity-85 hover:opacity-100"
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

      {/* Class Logo / Icon Upload */}
      <div className="rounded-xl border border-border bg-canvas/40 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-xs">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Class logo preview"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary/10 text-base font-bold text-primary">
                  {form.className?.trim()?.slice(0, 2)?.toUpperCase() || "CL"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-heading">
                Class logo or avatar{" "}
                <span className="text-xs font-normal text-text-muted">
                  (optional)
                </span>
              </p>
              <p className="mt-0.5 max-w-sm text-xs text-text-muted">
                A square icon displayed on classroom cards, explore feeds, and
                headers.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-heading shadow-xs transition hover:bg-canvas focus-within:ring-2 focus-within:ring-primary">
              <Camera className="h-3.5 w-3.5 text-primary" />
              <span>{logoPreview ? "Change logo" : "Upload logo"}</span>
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
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-text-muted transition-colors hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
