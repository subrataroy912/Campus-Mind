import { useState } from "react";
import { MEETING_TYPES } from "../../model/createSpaceForm.js";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Plus, X } from "lucide-react";
import { SpaceSelect } from "./SpaceSelect.jsx";

export function SpaceScheduleSection({ form, update, addTag, removeTag }) {
  const currentMeetingType = form.meetingType || "IN_PERSON";
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (addTag) {
      addTag(tagInput.trim());
    } else {
      const clean = tagInput.trim().replace(/^#/, "").toLowerCase();
      const existing = form.tags || [];
      if (!existing.includes(clean)) {
        update("tags", [...existing, clean]);
      }
    }
    setTagInput("");
  };

  const handleRemoveTag = (t) => {
    if (removeTag) {
      removeTag(t);
    } else {
      update(
        "tags",
        (form.tags || []).filter((item) => item !== t),
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Meeting Format & Location side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="create-space-meeting-type"
            className="block text-xs font-semibold text-text-heading"
          >
            Meeting Format
          </label>
          <SpaceSelect
            id="create-space-meeting-type"
            value={currentMeetingType}
            onChange={(val) => update("meetingType", val)}
            options={MEETING_TYPES}
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="location"
            className="block text-xs font-semibold text-text-heading"
          >
            {currentMeetingType === "ONLINE"
              ? "Virtual Meeting Link"
              : currentMeetingType === "HYBRID"
                ? "Location & Virtual Link"
                : "Location / Room"}
          </label>
          <Input
            id="location"
            type="text"
            value={form.location || form.room || ""}
            onChange={(e) => {
              update("location", e.target.value);
              update("room", e.target.value);
            }}
            placeholder={
              currentMeetingType === "ONLINE"
                ? "e.g. meet.google.com/xyz or Zoom link"
                : "e.g. Room 301, Science Hall B"
            }
            className="h-9 text-xs"
            maxLength={500}
          />
        </div>
      </div>

      {/* Discovery Tags */}
      <div className="space-y-1">
        <label
          htmlFor="tagInput"
          className="block text-xs font-semibold text-text-heading"
        >
          Tags
        </label>
        <div className="flex gap-2">
          <Input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Type a tag and press Enter (e.g. algorithms, python, robotics)"
            className="h-9 text-xs"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-main hover:bg-canvas disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Tag Pills */}
        {form.tags && form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {form.tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="gap-1 py-0.5 px-2 text-xs font-medium"
              >
                <span>#{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 cursor-pointer"
                  aria-label={`Remove tag ${t}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const ClassScheduleSection = SpaceScheduleSection;
export default SpaceScheduleSection;
