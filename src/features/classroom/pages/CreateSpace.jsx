import { Link } from "react-router";
import {
  ArrowLeft,
  Camera,
  Check,
  Globe,
  ImagePlus,
  KeyRound,
  Loader2,
  Lock,
  PlusCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { cn } from "@/lib/utils.js";
import { useCreateSpaceForm } from "../hooks/useCreateSpaceForm.js";
import { SUBJECTS, THEME_COLORS } from "../model/createSpaceForm.js";
import { getClassTheme } from "../utils/classTheme.js";
import { initials } from "@/utils/initials.js";
import { routes } from "@/routes/paths.js";

const ACCESS_OPTIONS = [
  {
    id: "code",
    title: "Class Code",
    description: "Students enter an 8-character enrollment code you share.",
    icon: KeyRound,
  },
  {
    id: "open",
    title: "Public / Open",
    description: "Anyone browsing explore or with the link can join directly.",
    icon: Globe,
  },
  {
    id: "invite",
    title: "Invite Only",
    description: "Only members specifically invited or added by you can join.",
    icon: Lock,
  },
];

export default function CreateSpace() {
  const {
    form,
    preview,
    logoPreview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    update,
    handleImageUpload,
    removeCoverImage,
    handleLogoUpload,
    removeLogoImage,
    reset,
    submit,
  } = useCreateSpaceForm();

  const currentTheme = getClassTheme({ theme: form.theme });
  const isCustomSubject = form.subject === "Other";
  const logoInitials = form.className?.trim()
    ? initials(form.className)
    : "SP";
  const displaySubject = isCustomSubject
    ? form.customSubject?.trim() || "Custom Subject"
    : form.subject || "Subject";

  return (
    <div className="min-h-screen bg-canvas py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Link */}
        <div className="mb-3">
          <Link
            to={routes.spaces.list}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to spaces</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text-heading sm:text-2xl">
                Create a space
              </h1>
              <p className="text-[12px] text-text-muted">
                Set up a new space for your class, study group, or project team.
              </p>
            </div>
          </div>
        </div>

        {/* Global Submission Error */}
        {submissionError && (
          <div
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300 shadow-2xs"
            role="alert"
          >
            <p className="font-semibold">Unable to create space</p>
            <p className="mt-0.5">{submissionError}</p>
          </div>
        )}

        {/* Single Unified Form Card */}
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border sm:p-5"
        >
          {/* Real-time Banner + Logo + Name Preview Card */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs">
            {/* Banner Preview */}
            <div
              className={cn(
                "group relative flex h-32 sm:h-40 md:h-48 w-full items-center justify-center overflow-hidden transition-all",
                preview ? "bg-canvas" : currentTheme.gradientClass
              )}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Cover preview"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />
              )}

              {/* Banner Upload / Change Overlay */}
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1.5 bg-black/0 text-xs font-medium text-transparent opacity-0 transition-all group-hover:bg-black/45 group-hover:text-white group-hover:opacity-100">
                <ImagePlus className="h-4 w-4" />
                <span>
                  {preview ? "Change banner image" : "Upload banner image"}
                </span>
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

              {/* Remove Banner Image Button */}
              {preview && (
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 cursor-pointer"
                  title="Remove banner"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Banner Size Recommendation Badge */}
              <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs pointer-events-none">
                Banner: 1920 × 480px (4:1) · Safe area centered
              </div>
            </div>

            {/* Identity Row (Overlapping Logo + Real-time Name & Details) */}
            <div className="relative px-4 pb-3 pt-2">
              {/* Real-time Logo */}
              <div className="absolute -top-7 sm:-top-9 md:-top-10 left-4">
                <label
                  className="group/logo relative block h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 cursor-pointer overflow-hidden rounded-2xl border-2 sm:border-[3px] md:border-4 border-surface bg-surface shadow-md ring-1 ring-border"
                  title="Upload space logo (Recommended: 400 × 400px, 1:1 square · Max 2MB)"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-primary/10 text-sm sm:text-base md:text-lg font-bold text-primary select-none">
                      {logoInitials}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover/logo:bg-black/45 group-hover/logo:opacity-100">
                    <Camera className="h-4 w-4 text-white" />
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

                {/* Remove Logo Image Button */}
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogoImage}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 cursor-pointer shadow-xs"
                    title="Remove logo"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>

              {/* Real-time Title and Subtitle */}
              <div className="pl-18 sm:pl-22 md:pl-24 min-h-12 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-text-heading truncate">
                    {form.className?.trim() || "Space Name"}
                  </h2>
                  <span className="shrink-0 rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border/70">
                    Live Preview
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-text-muted mt-0.5">
                  <span className="truncate">
                    {displaySubject}
                    {form.section?.trim() ? ` • ${form.section.trim()}` : ""}
                  </span>
                  <span className="text-[10px] text-text-muted/70">
                    (Logo: 400 × 400px 1:1)
                  </span>
                </div>
              </div>

              {/* Accent Theme Swatches (when no custom banner image is uploaded) */}
              {!preview && (
                <div className="flex items-center gap-2 pt-2.5 mt-2 border-t border-border/40">
                  <span className="text-[11px] font-medium text-text-muted">
                    Theme color:
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
                          className={cn(
                            "h-4 w-4 rounded-full transition-transform hover:scale-110 cursor-pointer",
                            c.swatchClass,
                            isSelected
                              ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110"
                              : "ring-1 ring-border/80 opacity-80 hover:opacity-100"
                          )}
                          style={
                            c.colorHex
                              ? { backgroundColor: c.colorHex }
                              : undefined
                          }
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
          </div>

          {/* Space Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="className"
              className="text-xs font-medium text-text-main"
            >
              Space name <span className="text-secondary">*</span>
            </Label>
            <Input
              id="className"
              type="text"
              value={form.className}
              onChange={(e) => update("className", e.target.value)}
              placeholder="e.g. Advanced Machine Learning, Physics 101"
              aria-invalid={!!errors.className}
              className={cn(
                "h-9 text-sm",
                errors.className &&
                  "border-secondary focus-visible:ring-secondary/20"
              )}
            />
            {errors.className && (
              <p className="text-xs font-medium text-secondary">
                {errors.className}
              </p>
            )}
          </div>

          {/* Subject & Section in a responsive 2-column row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Subject / Category */}
            <div className="space-y-1.5">
              <Label
                htmlFor="subject"
                className="text-xs font-medium text-text-main"
              >
                Subject / Category <span className="text-secondary">*</span>
              </Label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={cn(
                  "h-9 w-full rounded-lg border bg-surface px-3 text-sm text-text-heading outline-none transition focus:ring-1 focus:ring-focus",
                  errors.subject
                    ? "border-secondary focus:ring-secondary/20"
                    : "border-border hover:border-text-muted/50"
                )}
              >
                <option value="">Select subject or domain</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-xs font-medium text-secondary">
                  {errors.subject}
                </p>
              )}

              {/* Custom Subject Input if 'Other' */}
              {isCustomSubject && (
                <div className="pt-1">
                  <Input
                    type="text"
                    value={form.customSubject || ""}
                    onChange={(e) => update("customSubject", e.target.value)}
                    placeholder="Enter custom subject..."
                    className={cn(
                      "h-9 text-sm",
                      errors.customSubject &&
                        "border-secondary focus-visible:ring-secondary/20"
                    )}
                    autoFocus
                  />
                  {errors.customSubject && (
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {errors.customSubject}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Section / Cohort */}
            <div className="space-y-1.5">
              <Label
                htmlFor="section"
                className="text-xs font-medium text-text-main"
              >
                Section / Cohort
              </Label>
              <Input
                id="section"
                type="text"
                value={form.section || ""}
                onChange={(e) => update("section", e.target.value)}
                placeholder="e.g. Section A, Batch '26, Pod B"
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-medium text-text-main"
            >
              Description
            </Label>
            <Textarea
              id="description"
              rows={2}
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief overview, syllabus highlights, or welcoming note for new members..."
              className="min-h-16 resize-y text-sm max-h-40"
            />
          </div>

          {/* Access & Privacy */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-medium text-text-main">
              Access & Privacy
            </Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {ACCESS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = (form.accessType || "code") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update("accessType", opt.id)}
                    className={cn(
                      "relative flex flex-col items-start rounded-xl border p-2.5 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/8 ring-1 ring-primary shadow-2xs"
                        : "border-border bg-surface hover:border-border/80 hover:bg-canvas/40"
                    )}
                  >
                    <div className="flex w-full items-center justify-between mb-1">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md",
                          isSelected
                            ? "bg-primary text-surface"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 stroke-[2.5] text-primary" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-text-heading">
                      {opt.title}
                    </span>
                    <span className="mt-0.5 text-[11px] leading-tight text-text-muted line-clamp-2">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border-border hover:bg-canvas text-text-main text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
              <span>Reset</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover font-medium text-surface shadow-xs disabled:opacity-50 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating space…</span>
                </>
              ) : (
                <span>Create space</span>
              )}
            </Button>
          </div>

          {/* Inline Success Notice */}
          {submitted && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-300 font-medium">
              Space created successfully. Redirecting to your new space…
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
