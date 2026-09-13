import { DAYS, MEETING_TYPES } from "../../model/createClassForm.js";

export function ClassScheduleSection({ form, update, toggleDay }) {
  const currentMeetingType = form.meetingType || "IN_PERSON";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Schedule & Location
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Specify meeting format, physical room or virtual link, and recurring days (optional).
        </p>
      </div>

      {/* Meeting Format */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-main">
          Meeting format
        </label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {MEETING_TYPES.map((type) => {
            const isSelected = currentMeetingType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => update("meetingType", type.id)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-surface hover:border-border/80"
                }`}
              >
                <span className="text-xs font-semibold text-text-heading">
                  {type.label}
                </span>
                <span className="mt-0.5 text-[11px] text-text-muted leading-tight">
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location / Meeting Link */}
      <div>
        <label className="mb-1 block text-sm font-medium text-text-main">
          {currentMeetingType === "ONLINE"
            ? "Virtual Meeting Link or Platform"
            : currentMeetingType === "HYBRID"
            ? "Room & Meeting Link"
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
              ? "e.g. https://meet.google.com/xyz or Discord Server"
              : "e.g. Room 402, Science Hall or Library Study Pod B"
          }
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-heading outline-none transition hover:border-text-muted/50 focus:ring-2 focus:ring-focus"
        />
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
