import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useUpdateClassroomMutation } from "../api/classroomApi.js";
import {
  MEETING_TYPES,
  SPACE_TYPES,
  ACCESS_TYPES,
} from "../model/createSpaceForm.js";

function EditSpaceForm({ classroom, onClose }) {
  const [title, setTitle] = useState(() => classroom?.title || classroom?.name || "");
  const [spaceType, setSpaceType] = useState(() => classroom?.spaceType || "ACADEMIC_CLASS");
  const [subject, setSubject] = useState(() => classroom?.subject || "");
  const [section, setSection] = useState(() => classroom?.section || classroom?.subtitle || "");
  const [description, setDescription] = useState(() => classroom?.description || "");
  const [meetingType, setMeetingType] = useState(() => classroom?.meetingType || "IN_PERSON");
  const [location, setLocation] = useState(() => classroom?.location || classroom?.room || "");
  const [tagsInput, setTagsInput] = useState(() =>
    Array.isArray(classroom?.tags) ? classroom.tags.join(", ") : ""
  );
  const [accessType, setAccessType] = useState(() =>
    (classroom?.accessType || "CODE").toUpperCase()
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [updateClassroom, { isLoading }] = useUpdateClassroomMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Space title is required");
      return;
    }

    setErrorMsg("");
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await updateClassroom({
        courseId: classroom.id,
        changes: {
          title: title.trim(),
          spaceType,
          subject: subject.trim() || undefined,
          section: section.trim() || undefined,
          description: description.trim() || undefined,
          meetingType,
          location: location.trim() || undefined,
          tags: parsedTags,
          accessType,
          visibility: accessType === "OPEN" ? "PUBLIC" : "PRIVATE",
        },
      }).unwrap();
      onClose();
    } catch (err) {
      setErrorMsg(
        err?.data?.message ||
          err?.data?.error ||
          err?.message ||
          "Failed to update space details"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4 flex-1">
        {errorMsg && (
          <div
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs font-medium text-destructive"
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        {/* Space Name & Space Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="edit-space-title"
              className="text-xs font-semibold text-text-heading"
            >
              Space Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="edit-space-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CS101 or AI Research Lab"
              required
              disabled={isLoading}
              className="h-8.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="edit-space-type"
              className="text-xs font-semibold text-text-heading"
            >
              Space Type
            </label>
            <select
              id="edit-space-type"
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              disabled={isLoading}
              className="w-full h-8.5 rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-text-main focus:border-primary focus:outline-hidden cursor-pointer"
            >
              {SPACE_TYPES.map((type) => (
                <option key={type.id || type.value} value={type.id || type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject & Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="edit-space-subject"
              className="text-xs font-semibold text-text-heading"
            >
              Subject / Domain
            </label>
            <Input
              id="edit-space-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Robotics"
              disabled={isLoading}
              className="h-8.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="edit-space-section"
              className="text-xs font-semibold text-text-heading"
            >
              Section / Cohort
            </label>
            <Input
              id="edit-space-section"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Batch 2026, Section A"
              disabled={isLoading}
              className="h-8.5 text-xs"
            />
          </div>
        </div>

        {/* Meeting Type & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="edit-space-meeting-type"
              className="text-xs font-semibold text-text-heading"
            >
              Meeting Format
            </label>
            <select
              id="edit-space-meeting-type"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              disabled={isLoading}
              className="w-full h-8.5 rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-text-main focus:border-primary focus:outline-hidden cursor-pointer"
            >
              {MEETING_TYPES.map((m) => (
                <option key={m.id || m.value} value={m.id || m.value}>
                  {m.label} ({m.description?.split(",")[0] || m.label})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="edit-space-location"
              className="text-xs font-semibold text-text-heading"
            >
              {meetingType === "ONLINE" ? "Meeting Link" : "Room / Location"}
            </label>
            <Input
              id="edit-space-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={
                meetingType === "ONLINE"
                  ? "https://meet.google.com/..."
                  : "Room 304, Tech Wing"
              }
              disabled={isLoading}
              className="h-8.5 text-xs"
            />
          </div>
        </div>

        {/* Tags & Access Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div className="space-y-1">
            <label
              htmlFor="edit-space-tags"
              className="text-xs font-semibold text-text-heading"
            >
              Tags (comma separated)
            </label>
            <Input
              id="edit-space-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Python, AI, Hackathon"
              disabled={isLoading}
              className="h-8.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="edit-space-access"
              className="text-xs font-semibold text-text-heading"
            >
              Access Level
            </label>
            <select
              id="edit-space-access"
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              disabled={isLoading}
              className="w-full h-8.5 rounded-lg border border-border bg-canvas px-2.5 py-1 text-xs text-text-main focus:border-primary focus:outline-hidden cursor-pointer"
            >
              {ACCESS_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="edit-space-description"
            className="text-xs font-semibold text-text-heading"
          >
            Description
          </label>
          <Textarea
            id="edit-space-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={isLoading}
            placeholder="What this space is about, topics covered, and guidelines..."
            className="resize-none text-xs bg-canvas/50 min-h-20"
          />
        </div>
      </div>

      {/* Responsive Footer Actions */}
      <div className="p-3.5 sm:p-4 border-t border-border bg-canvas/40 shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto h-8 text-xs font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="w-full sm:w-auto h-8 text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export function EditSpaceModal({ isOpen, onClose, classroom }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border bg-surface shadow-xl">
        {/* Sticky Header */}
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border shrink-0 text-left">
          <DialogTitle className="text-base sm:text-lg font-bold text-text-heading">
            Edit Space Details
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Update identity, meeting format, tags, and access permissions for this space.
          </DialogDescription>
        </DialogHeader>

        {isOpen && classroom && (
          <EditSpaceForm
            key={`${classroom.id}-${classroom.updatedAt || "initial"}`}
            classroom={classroom}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditSpaceModal;
