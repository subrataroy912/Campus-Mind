import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link } from "react-router";
import { ArrowLeft, Loader2, PlusCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useCreateClassForm } from "../hooks/useCreateClassForm.js";
import {
  CreatorUnlockBanner,
  ClassMediaSection,
  ClassBasicInfoSection,
  ClassAcademicSection,
  ClassScheduleSection,
  ClassAccessTypeSection,
} from "../components/createClass/index.js";

export default function CreateClass() {
  const { user, unlockCreator } = useAuth();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const {
    form,
    preview,
    logoPreview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    update,
    toggleDay,
    handleImageUpload,
    handleLogoUpload,
    reset,
    submit,
  } = useCreateClassForm();

  const isStudentWithoutCreator =
    user?.accountType === "STUDENT" && !user?.canCreateCourses;

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setUnlockError("");
    try {
      await unlockCreator();
    } catch (err) {
      setUnlockError(
        err?.data?.error ||
          err?.message ||
          "Failed to unlock course creation privileges."
      );
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to classes</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
                Create a class
              </h1>
              <p className="text-xs text-text-muted sm:text-sm">
                Set up a new learning space, customize its branding, and invite your students.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Privileges Alert */}
        <CreatorUnlockBanner
          isStudentWithoutCreator={isStudentWithoutCreator}
          handleUnlock={handleUnlock}
          isUnlocking={isUnlocking}
          unlockError={unlockError}
        />

        {/* Global Submission Error */}
        {submissionError && (
          <div
            className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300 shadow-xs"
            role="alert"
          >
            <p className="font-semibold">Unable to create class</p>
            <p className="mt-0.5 text-xs">{submissionError}</p>
          </div>
        )}

        {/* Main Creation Form */}
        <form
          onSubmit={submit}
          className="space-y-8 rounded-3xl bg-surface p-5 shadow-xs ring-1 ring-border sm:p-8"
        >
          {/* Section 1: Media & Branding */}
          <ClassMediaSection
            form={form}
            preview={preview}
            logoPreview={logoPreview}
            update={update}
            handleImageUpload={handleImageUpload}
            handleLogoUpload={handleLogoUpload}
          />

          <hr className="border-border/60" />

          {/* Section 2: Basic Info */}
          <ClassBasicInfoSection
            form={form}
            errors={errors}
            update={update}
          />

          <hr className="border-border/60" />

          {/* Section 3: Academic Details (Subject & Target Grade with 'Other' custom inputs) */}
          <ClassAcademicSection
            form={form}
            errors={errors}
            update={update}
          />

          <hr className="border-border/60" />

          {/* Section 4: Schedule & Timing */}
          <ClassScheduleSection
            form={form}
            update={update}
            toggleDay={toggleDay}
          />

          <hr className="border-border/60" />

          {/* Section 5: Access & Enrollment Type */}
          <ClassAccessTypeSection
            form={form}
            update={update}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border-border hover:bg-canvas text-text-main"
            >
              <RotateCcw className="h-4 w-4 text-text-muted" />
              <span>Reset</span>
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isStudentWithoutCreator}
              title={
                isStudentWithoutCreator
                  ? "Unlock course creation privileges above first"
                  : undefined
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover font-medium text-surface shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating class…</span>
                </>
              ) : (
                <span>Create class</span>
              )}
            </Button>
          </div>

          {/* Inline Success Notice */}
          {submitted && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300 font-medium">
              Class created successfully. Redirecting to your new classroom…
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
