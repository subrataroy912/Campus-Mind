import { GRADE_LEVELS, SUBJECTS, SPACE_TYPES } from "../../model/createSpaceForm.js";

export function SpaceAcademicSection({ form, errors, update }) {
  const isCustomSubject = form.subject === "Other";
  const isCustomGrade = form.gradeLevel === "Other";
  const spaceTypeMeta =
    SPACE_TYPES.find((t) => t.id === form.spaceType) || SPACE_TYPES[0];
  const isAcademicClass = form.spaceType === "ACADEMIC_CLASS" || !form.spaceType;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {isAcademicClass ? "Academic Focus" : "Focus & Category"}
        </label>
        <p className="text-[12px] text-text-muted">
          {isAcademicClass
            ? "Set subject and target grade level."
            : `Set the primary subject and target audience for your ${spaceTypeMeta.label.toLowerCase()}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Subject / Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-text-main">
            {spaceTypeMeta.categoryLabel || "Subject"} <span className="text-secondary">*</span>
          </label>
          <select
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm text-text-heading outline-none transition focus:ring-1 focus:ring-focus ${
              errors.subject
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
            }`}
          >
            <option value="">Select {spaceTypeMeta.categoryLabel?.toLowerCase() || "subject"}</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-xs text-secondary font-medium">{errors.subject}</p>
          )}

          {/* Custom Subject Input when 'Other' is selected */}
          {isCustomSubject && (
            <div className="pt-1 transition-all animate-in fade-in duration-150">
              <input
                type="text"
                value={form.customSubject}
                onChange={(e) => update("customSubject", e.target.value)}
                placeholder={`Specify custom ${spaceTypeMeta.categoryLabel?.toLowerCase() || "subject"}`}
                className={`h-9 w-full rounded-lg border px-3 text-sm text-text-heading bg-surface outline-none transition focus:ring-1 focus:ring-focus ${
                  errors.customSubject
                    ? "border-secondary focus:ring-secondary/20"
                    : "border-border hover:border-text-muted/50"
                }`}
                autoFocus
              />
              {errors.customSubject && (
                <p className="mt-0.5 text-xs text-secondary font-medium">
                  {errors.customSubject}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Target Grade / Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-text-main">
            {spaceTypeMeta.levelLabel || "Target Grade"} {isAcademicClass && <span className="text-secondary">*</span>}
          </label>
          <select
            value={form.gradeLevel}
            onChange={(e) => update("gradeLevel", e.target.value)}
            className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm text-text-heading outline-none transition focus:ring-1 focus:ring-focus ${
              errors.gradeLevel
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
            }`}
          >
            <option value="">Select {spaceTypeMeta.levelLabel?.toLowerCase() || "level"}</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.gradeLevel && (
            <p className="text-xs text-secondary font-medium">
              {errors.gradeLevel}
            </p>
          )}

          {/* Custom Target Grade Input when 'Other' is selected */}
          {isCustomGrade && (
            <div className="pt-1 transition-all animate-in fade-in duration-150">
              <input
                type="text"
                value={form.customGradeLevel}
                onChange={(e) => update("customGradeLevel", e.target.value)}
                placeholder="Specify target grade/level"
                className={`h-9 w-full rounded-lg border px-3 text-sm text-text-heading bg-surface outline-none transition focus:ring-1 focus:ring-focus ${
                  errors.customGradeLevel
                    ? "border-secondary focus:ring-secondary/20"
                    : "border-border hover:border-text-muted/50"
                }`}
                autoFocus
              />
              {errors.customGradeLevel && (
                <p className="mt-0.5 text-xs text-secondary font-medium">
                  {errors.customGradeLevel}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
