export function SpaceBasicInfoSection({ form, errors, update }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Basic Details
        </label>
        <p className="text-[12px] text-text-muted">
          Identify your space with a clear title and brief description.
        </p>
      </div>

      {/* Space Name + Section in a responsive row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-text-main">
            Space name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={form.className}
            onChange={(e) => update("className", e.target.value)}
            placeholder="e.g. Advanced Algorithms, AI Study Group"
            className={`h-9 w-full rounded-lg border px-3 text-sm text-text-heading bg-surface outline-none transition focus:ring-1 focus:ring-focus ${
              errors.className
                ? "border-secondary focus:ring-secondary/20"
                : "border-border hover:border-text-muted/50"
            }`}
          />
          {errors.className && (
            <p className="mt-0.5 text-xs text-secondary font-medium">
              {errors.className}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-main">
            Section / Cohort
          </label>
          <input
            type="text"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
            placeholder="e.g. Batch '26, Pod B"
            className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-1 focus:ring-focus"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-xs font-medium text-text-main">
          Description & Goals
        </label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Brief overview or welcoming note for new members..."
          className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-1 focus:ring-focus"
        />
      </div>
    </div>
  );
}
