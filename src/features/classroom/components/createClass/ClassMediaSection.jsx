import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { THEME_COLORS } from "../../model/createClassForm.js";

export function ClassMediaSection({
  form,
  preview,
  logoPreview,
  update,
  handleImageUpload,
  handleLogoUpload,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Branding & Media
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Add an optional cover banner and logo icon to give your class a recognizable identity.
        </p>
      </div>

      {/* Cover Banner */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-text-main">
            Class cover banner{" "}
            <span className="text-xs text-text-muted font-normal">
              (optional, 16:9 recommended)
            </span>
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => update("coverImage", null)}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove cover</span>
            </button>
          )}
        </div>

        <div
          className={`relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-border shadow-xs sm:h-44 ${
            preview ? "" : form.theme
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center px-4">
              <span className="text-lg font-bold tracking-tight text-white/90 sm:text-2xl drop-shadow-xs">
                {form.className || "Your Class Title"}
              </span>
              {form.section && (
                <p className="mt-0.5 text-xs text-white/70 font-medium">
                  {form.section}
                </p>
              )}
            </div>
          )}

          <label className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-surface/90 px-3 py-1.5 text-xs font-medium text-text-heading shadow-md hover:bg-surface flex items-center gap-1.5 backdrop-blur-xs transition border border-border/50">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span>{preview ? "Change cover" : "Upload cover image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Fallback Theme Color Selection */}
        {!preview && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-muted font-medium">
              Accent theme:
            </span>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map((c, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => update("theme", c.value)}
                  className={`h-6 w-6 rounded-full ${c.value} ring-offset-2 transition hover:scale-105 ${
                    form.theme === c.value
                      ? "ring-2 ring-primary ring-offset-surface"
                      : "ring-1 ring-border"
                  }`}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Class Logo / Icon Upload */}
      <div className="rounded-xl border border-border bg-canvas/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-xs">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Class logo preview"
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
                <span className="text-xs text-text-muted font-normal">
                  (optional)
                </span>
              </p>
              <p className="text-xs text-text-muted mt-0.5 max-w-sm">
                A square icon displayed on classroom cards, explore feeds, and headers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-heading shadow-xs hover:bg-canvas flex items-center gap-1.5 transition">
              <Camera className="h-3.5 w-3.5 text-primary" />
              <span>{logoPreview ? "Change logo" : "Upload logo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {logoPreview && (
              <button
                type="button"
                onClick={() => update("logoImage", null)}
                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-500 transition-colors px-2 py-1.5"
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
