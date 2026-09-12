import { DAYS } from "../../model/createClassForm.js";

export function ClassScheduleSection({ form, update, toggleDay }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Schedule & Timing
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Specify recurring class days and session start/end hours (optional).
        </p>
      </div>

      {/* Days of Week */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-main">
          Meeting days
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isSelected = form.days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-surface shadow-xs scale-102"
                    : "bg-canvas text-text-main hover:bg-border/70 border border-border"
                }`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start and End Times */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            Start time
          </label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => update("startTime", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            End time
          </label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => update("endTime", e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
          />
        </div>
      </div>
    </div>
  );
}
