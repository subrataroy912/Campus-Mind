import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useCreateClassForm } from "../hooks/useCreateClassForm.js";
import {
  DAYS,
  GRADE_LEVELS,
  SUBJECTS,
  THEME_COLORS,
} from "../model/createClassForm.js";

export default function CreateClass() {
  const { user, unlockCreator } = useAuth();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const {
    form,
    preview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    update,
    toggleDay,
    handleImageUpload,
    reset,
    submit,
  } = useCreateClassForm();

  const isStudentWithoutCreator = user?.accountType === "STUDENT" && !user?.canCreateCourses;

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setUnlockError("");
    try {
      await unlockCreator();
    } catch (err) {
      setUnlockError(err?.data?.error || err?.message || "Failed to unlock course creation privileges.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-heading transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to classes</span>
          </Link>
        </div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-text-heading sm:text-3xl">
            Create a class
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Set up a new class for your students to join.
          </p>
        </div>

        {isStudentWithoutCreator && (
          <div
            className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-sm text-amber-900 dark:text-amber-200"
            role="alert"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                  Unlock Course Creation
                </p>
                <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  Your account is registered as a <strong>Student</strong>. Unlock creator privileges to set up classes, lead study groups, or host workshops.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleUnlock}
                disabled={isUnlocking}
                size="sm"
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-medium"
              >
                {isUnlocking ? "Unlocking…" : "Unlock course creation"}
              </Button>
            </div>
            {unlockError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-300 font-medium">
                {unlockError}
              </p>
            )}
          </div>
        )}

        {submissionError && (
          <div
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
            role="alert"
          >
            <p className="font-semibold">Unable to create class</p>
            <p className="mt-1">{submissionError}</p>
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-6 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6 lg:p-8"
        >
          {/* Cover image / theme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Class theme / cover image
            </label>
            <div
              className={`relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl sm:h-40 ${
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
                <span className="text-lg font-semibold text-surface/90 sm:text-xl">
                  {form.className || "Your class name"}
                </span>
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-surface/90 px-3 py-1.5 text-xs font-medium text-text-main shadow hover:bg-surface">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {!preview && (
              <div className="mt-3 flex flex-wrap gap-2">
                {THEME_COLORS.map((c, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => update("theme", c.value)}
                    className={`h-7 w-7 rounded-full ${
                      c.value
                    } ring-offset-2 transition ${
                      form.theme === c.value
                        ? "ring-2 ring-text-heading"
                        : "ring-1 ring-border"
                    }`}
                    aria-label={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Class name + Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text-main">
                Class name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={form.className}
                onChange={(e) => update("className", e.target.value)}
                placeholder="e.g. Algebra II"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.className ? "border-secondary" : "border-border"
                }`}
              />
              {errors.className && (
                <p className="mt-1 text-xs text-secondary">
                  {errors.className}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">
                Section
              </label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => update("section", e.target.value)}
                placeholder="e.g. Period 3"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
              />
            </div>
          </div>

          {/* Subject + Grade level */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">
                Subject <span className="text-secondary">*</span>
              </label>
              <select
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.subject ? "border-secondary" : "border-border"
                }`}
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-xs text-secondary">{errors.subject}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">
                Grade level <span className="text-secondary">*</span>
              </label>
              <select
                value={form.gradeLevel}
                onChange={(e) => update("gradeLevel", e.target.value)}
                className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.gradeLevel ? "border-secondary" : "border-border"
                }`}
              >
                <option value="">Select grade level</option>
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gradeLevel && (
                <p className="mt-1 text-xs text-secondary">
                  {errors.gradeLevel}
                </p>
              )}
            </div>
          </div>

          {/* Room / Location */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Room / location
            </label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => update("room", e.target.value)}
              placeholder="e.g. Room 204 or https://zoom.us/j/..."
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A brief overview of the course, syllabus, or a welcome message"
              className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Schedule / meeting times
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    form.days.includes(day)
                      ? "bg-primary text-surface"
                      : "bg-canvas text-text-main hover:bg-border"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  Start time
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  End time
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
                />
              </div>
            </div>
          </div>

          {/* Access type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Access type
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  value: "invite",
                  label: "Invite only",
                  desc: "Add students manually",
                },
                {
                  value: "code",
                  label: "Class code",
                  desc: "Students join with a code",
                },
                {
                  value: "open",
                  label: "Open",
                  desc: "Anyone with the link can join",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                    form.accessType === opt.value
                      ? "border-primary bg-canvas"
                      : "border-border hover:border-text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="accessType"
                    value={opt.value}
                    checked={form.accessType === opt.value}
                    onChange={(e) => update("accessType", e.target.value)}
                    className="sr-only"
                  />
                  <p className="font-medium text-text-heading">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={reset}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas sm:w-auto"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isStudentWithoutCreator}
              title={isStudentWithoutCreator ? "Unlock course creation privileges above first" : undefined}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
            >
              {isSubmitting ? "Creating class…" : "Create class"}
            </button>
          </div>

          {submitted && (
            <div className="rounded-lg bg-canvas px-4 py-3 text-sm text-success">
              Class created successfully.
            </div>
          )}
          {submissionError && (
            <div
              className="rounded-lg bg-secondary/10 px-4 py-3 text-sm text-secondary"
              role="alert"
            >
              {submissionError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
