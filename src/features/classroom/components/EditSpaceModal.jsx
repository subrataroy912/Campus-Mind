import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useUpdateClassroomMutation } from "../api/classroomApi.js";
import { SPACE_TYPES } from "../model/createSpaceForm.js";

const MEETING_TYPES = [
  { value: "IN_PERSON", label: "In-Person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
];

const ACCESS_TYPES = [
  { value: "OPEN", label: "Open (Public)" },
  { value: "CODE", label: "Code Protected" },
  { value: "INVITE", label: "Invite Only" },
];

export function EditSpaceModal({ isOpen, onClose, classroom }) {
  const [title, setTitle] = useState(() => classroom?.title || classroom?.name || "");
  const [spaceType, setSpaceType] = useState(() => classroom?.spaceType || "ACADEMIC_CLASS");
  const [subject, setSubject] = useState(() => classroom?.subject || "");
  const [section, setSection] = useState(() => classroom?.section || classroom?.subtitle || "");
  const [description, setDescription] = useState(() => classroom?.description || "");
  const [meetingType, setMeetingType] = useState(() => classroom?.meetingType || "IN_PERSON");
  const [location, setLocation] = useState(() => classroom?.location || classroom?.room || "");
  const [tagsInput, setTagsInput] = useState(() => Array.isArray(classroom?.tags) ? classroom.tags.join(", ") : "");
  const [accessType, setAccessType] = useState(() => (classroom?.accessType || "CODE").toUpperCase());
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
        err?.data?.message || err?.data?.error || err?.message || "Failed to update space details"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-5">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="text-lg font-bold text-text-heading">
            Edit Space Details
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Update identity, category, schedule, and settings for this space.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {/* Space Title & Space Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                Space Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder="e.g. CS101 or AI Research Lab"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Space Type</label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
              >
                {SPACE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Subject / Domain</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder="e.g. Computer Science, Robotics"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Section / Cohort</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder="e.g. Batch 2026, Section A"
              />
            </div>
          </div>

          {/* Meeting Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Meeting Format</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
              >
                {MEETING_TYPES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                {meetingType === "ONLINE" ? "Meeting Link" : "Room / Location"}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder={meetingType === "ONLINE" ? "https://meet.google.com/..." : "Room 304, Tech Wing"}
              />
            </div>
          </div>

          {/* Tags & Access Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder="e.g. Python, AI, Hackathon"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">Access Level</label>
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
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
            <label className="text-xs font-semibold text-text-heading">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden resize-none"
              placeholder="What this space is about, topics covered, and guidelines..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-8 text-xs font-semibold"
            >
              {isLoading ? "Saving�" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
