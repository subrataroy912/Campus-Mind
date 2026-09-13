export function ClassBasicInfoSection({ form, errors, update }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Space Information
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Provide basic details like the space name, cohort/section, and description.
        </p>
      </div>

      {/* Space Name + Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-text-main">
            Space name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={form.className}
            onChange={(e) => update("className", e.target.value)}
            placeholder="e.g. Advanced Algorithms, AI Study Group, Robotics Club"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-heading bg-surface outline-none transition focus:ring-2 focus:ring-focus ${
              errors.className
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
            }`}
          />
          {errors.className && (
            <p className="mt-1 text-xs text-secondary font-medium">
              {errors.className}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            Section / Cohort
          </label>
          <input
            type="text"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
            placeholder="e.g. Batch 2026, Subteam A"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-main">
          Description & Goals
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="A brief overview of what this space is for, meeting objectives, or a welcoming note for members..."
          className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
        />
      </div>
    </div>
  );
}
