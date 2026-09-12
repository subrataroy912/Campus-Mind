import { GRADE_LEVELS, SUBJECTS } from "../../model/createClassForm.js";

export function ClassAcademicSection({ form, errors, update }) {
  const isCustomSubject = form.subject === "Other";
  const isCustomGrade = form.gradeLevel === "Other";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Academic Details
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Categorize your class by subject and target grade level. Selecting &ldquo;Other&rdquo; allows entering custom values.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Subject */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-main">
            Subject <span className="text-secondary">*</span>
          </label>
          <select
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
              errors.subject
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
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
            <p className="text-xs text-secondary font-medium">{errors.subject}</p>
          )}

          {/* Custom Subject Input when 'Other' is selected */}
          {isCustomSubject && (
            <div className="pt-1 transition-all animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Specify custom subject <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={form.customSubject}
                onChange={(e) => update("customSubject", e.target.value)}
                placeholder="e.g. Robotics, Astronomy, Creative Writing"
                className={`w-full rounded-xl border px-3.5 py-2 text-sm text-text-heading bg-surface outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.customSubject
                    ? "border-secondary focus:ring-secondary/20"
                    : "border-border hover:border-text-muted/50"
                }`}
                autoFocus
              />
              {errors.customSubject && (
                <p className="mt-1 text-xs text-secondary font-medium">
                  {errors.customSubject}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Target Grade / Grade Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-main">
            Target Grade <span className="text-secondary">*</span>
          </label>
          <select
            value={form.gradeLevel}
            onChange={(e) => update("gradeLevel", e.target.value)}
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
              errors.gradeLevel
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
            }`}
          >
            <option value="">Select target grade</option>
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
            <div className="pt-1 transition-all animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Specify custom target grade <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={form.customGradeLevel}
                onChange={(e) => update("customGradeLevel", e.target.value)}
                placeholder="e.g. High School Seniors, Adults, Continuing Ed"
                className={`w-full rounded-xl border px-3.5 py-2 text-sm text-text-heading bg-surface outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.customGradeLevel
                    ? "border-secondary focus:ring-secondary/20"
                    : "border-border hover:border-text-muted/50"
                }`}
                autoFocus
              />
              {errors.customGradeLevel && (
                <p className="mt-1 text-xs text-secondary font-medium">
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
