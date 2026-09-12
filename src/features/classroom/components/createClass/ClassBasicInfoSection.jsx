export function ClassBasicInfoSection({ form, errors, update }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Class Information
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Provide basic details like the course title, section code, and description.
        </p>
      </div>

      {/* Class Name + Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-text-main">
            Class name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={form.className}
            onChange={(e) => update("className", e.target.value)}
            placeholder="e.g. Advanced Calculus, Intro to Python"
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
            Section
          </label>
          <input
            type="text"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
            placeholder="e.g. Period 2, Batch A"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
          />
        </div>
      </div>

      {/* Room / Location */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-main">
          Room or meeting link
        </label>
        <input
          type="text"
          value={form.room}
          onChange={(e) => update("room", e.target.value)}
          placeholder="e.g. Building C Room 204 or https://meet.google.com/..."
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
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
          placeholder="A brief overview of the course syllabus, prerequisites, or a welcoming note for students..."
          className="w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
        />
      </div>
    </div>
  );
}
