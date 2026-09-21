import { DAYS, MEETING_TYPES } from "../../model/createSpaceForm.js";

export function SpaceScheduleSection({ form, update, toggleDay }) {
  const currentMeetingType = form.meetingType || "IN_PERSON";

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Meeting & Schedule
        </label>
        <p className="text-[12px] text-text-muted">
          Format, location, and meeting times.
        </p>
      </div>

      {/* Meeting Format - Segmented Horizontal Bar */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-main">
          Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {MEETING_TYPES.map((type) => {
            const isSelected = currentMeetingType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => update("meetingType", type.id)}
                className={`flex h-9 items-center justify-center rounded-lg border px-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40 shadow-xs"
                    : "border-border bg-surface text-text-main hover:border-border/80 hover:bg-canvas/50"
                }`}
                title={type.description}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location / Meeting Link */}
      <div>
        <label className="mb-1 block text-xs font-medium text-text-main">
          {currentMeetingType === "ONLINE"
            ? "Virtual Meeting Link or Platform"
            : currentMeetingType === "HYBRID"
            ? "Physical Room & Virtual Link"
            : "Room / Building / Location"}
        </label>
        <input
          type="text"
          value={form.location || form.room || ""}
          onChange={(e) => {
            update("location", e.target.value);
            update("room", e.target.value);
          }}
          placeholder={
            currentMeetingType === "ONLINE"
              ? "e.g. Google Meet link, Zoom, or Discord"
              : "e.g. Room 402, Hall B, or Lab 3"
          }
          className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-1 focus:ring-focus"
        />
      </div>

      {/* Days of Week + Time in a responsive row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Days of Week */}
        <div>
          <label className="mb-1 block text-xs font-medium text-text-main">
            Meeting days
          </label>
          <div className="flex flex-wrap gap-1">
            {DAYS.map((day) => {
              const isSelected = form.days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`h-7 rounded-md px-2 text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-surface shadow-2xs font-semibold"
                      : "bg-canvas text-text-main hover:bg-border/60 border border-border/80"
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-main">
              Start time
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => update("startTime", e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-1 focus:ring-focus"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-main">
              End time
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => update("endTime", e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-1 focus:ring-focus"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
