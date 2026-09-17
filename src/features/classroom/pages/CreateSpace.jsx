import { Link } from "react-router";
import { ArrowLeft, Loader2, PlusCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useCreateSpaceForm } from "../hooks/useCreateSpaceForm.js";
import {
  SpaceTypeSelector,
  SpaceMediaSection,
  SpaceBasicInfoSection,
  SpaceScheduleSection,
  SpaceAccessTypeSection,
} from "../components/createClass/index.js";
import { routes } from "@/routes/paths.js";

export default function CreateSpace() {
  const {
    form,
    preview,
    logoPreview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    isUploadingCover,
    isUploadingLogo,
    update,
    addTag,
    removeTag,
    handleImageUpload,
    handleLogoUpload,
    removeCover,
    removeLogo,
    reset,
    submit,
  } = useCreateSpaceForm();

  return (
    <div className="min-h-screen bg-canvas py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Navigation Back Link */}
        <div className="mb-2.5">
          <Link
            to={routes.spaces.list}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to spaces</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-text-heading sm:text-xl">
                Create a space
              </h1>
              <p className="text-xs text-text-muted">
                Set up a space for your class, study group, club, or project.
              </p>
            </div>
          </div>
        </div>

        {/* Global Submission Error */}
        {submissionError && (
          <div
            className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300 shadow-2xs"
            role="alert"
          >
            <p className="font-semibold">Unable to create space</p>
            <p className="mt-0.5">{submissionError}</p>
          </div>
        )}

        {/* Main Creation Form */}
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl bg-surface p-4 shadow-xs ring-1 ring-border sm:p-5"
        >
          {/* Section 0: Space Type Dropdown */}
          <SpaceTypeSelector form={form} update={update} />

          {/* Section 1: Media & Branding Preview */}
          <SpaceMediaSection
            form={form}
            preview={preview}
            logoPreview={logoPreview}
            update={update}
            handleImageUpload={handleImageUpload}
            handleLogoUpload={handleLogoUpload}
            onRemoveCover={removeCover}
            onRemoveLogo={removeLogo}
            isUploadingCover={isUploadingCover}
            isUploadingLogo={isUploadingLogo}
          />

          {/* Section 2: Basic Info */}
          <SpaceBasicInfoSection form={form} errors={errors} update={update} />

          {/* Section 3: Meeting, Location & Tags */}
          <SpaceScheduleSection
            form={form}
            update={update}
            addTag={addTag}
            removeTag={removeTag}
          />

          {/* Section 4: Access & Membership Type Dropdown */}
          <SpaceAccessTypeSection form={form} update={update} />

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-3.5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={isSubmitting || isUploadingCover || isUploadingLogo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border-border hover:bg-canvas text-text-main text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
              <span>Reset</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isUploadingCover || isUploadingLogo}
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
