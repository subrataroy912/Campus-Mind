import { useState } from "react";
import { createClassroom } from "../../features/classroom/api/classroomService";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Art",
  "Music", "Physical Education", "Computer Science", "Foreign Language", "Other",
];

const GRADE_LEVELS = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "College / Adult",
];

const THEME_COLORS = [
  { name: "Indigo", value: "bg-primary" },
  { name: "Emerald", value: "bg-success" },
  { name: "Rose", value: "bg-secondary" },
  { name: "Amber", value: "bg-secondary" },
  { name: "Sky", value: "bg-accent" },
  { name: "Violet", value: "bg-primary" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CreateClass() {
  const [form, setForm] = useState({
    className: "",
    section: "",
    subject: "",
    room: "",
    description: "",
    gradeLevel: "",
    days: [],
    startTime: "",
    endTime: "",
    accessType: "invite",
    theme: THEME_COLORS[0].value,
    coverImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update("coverImage", file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.className.trim()) newErrors.className = "Class name is required.";
    if (!form.subject) newErrors.subject = "Select a subject.";
    if (!form.gradeLevel) newErrors.gradeLevel = "Select a grade level.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }
    await createClassroom(form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-text-heading sm:text-3xl">
            Create a class
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Set up a new class for your students to join.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6 lg:p-8"
        >
          {/* Cover image / theme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Class theme / cover image
            </label>
            <div
              className={`relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl sm:h-40 ${
                preview ? "" : form.theme
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-surface/90 sm:text-xl">
                  {form.className || "Your class name"}
                </span>
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-surface/90 px-3 py-1.5 text-xs font-medium text-text-main shadow hover:bg-surface">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {!preview && (
              <div className="mt-3 flex flex-wrap gap-2">
                {THEME_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => update("theme", c.value)}
                    className={`h-7 w-7 rounded-full ${c.value} ring-offset-2 transition ${
                      form.theme === c.value
                        ? "ring-2 ring-text-heading"
                        : "ring-1 ring-border"
                    }`}
                    aria-label={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Class name + Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text-main">
                Class name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={form.className}
                onChange={(e) => update("className", e.target.value)}
                placeholder="e.g. Algebra II"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.className ? "border-secondary" : "border-border"
                }`}
              />
              {errors.className && (
                <p className="mt-1 text-xs text-secondary">{errors.className}</p>
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
                placeholder="e.g. Period 3"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
              />
            </div>
          </div>

          {/* Subject + Grade level */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">
                Subject <span className="text-secondary">*</span>
              </label>
              <select
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.subject ? "border-secondary" : "border-border"
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
                <p className="mt-1 text-xs text-secondary">{errors.subject}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-main">
                Grade level <span className="text-secondary">*</span>
              </label>
              <select
                value={form.gradeLevel}
                onChange={(e) => update("gradeLevel", e.target.value)}
                className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus ${
                  errors.gradeLevel ? "border-secondary" : "border-border"
                }`}
              >
                <option value="">Select grade level</option>
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gradeLevel && (
                <p className="mt-1 text-xs text-secondary">{errors.gradeLevel}</p>
              )}
            </div>
          </div>

          {/* Room / Location */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Room / location
            </label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => update("room", e.target.value)}
              placeholder="e.g. Room 204 or https://zoom.us/j/..."
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
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
              placeholder="A brief overview of the course, syllabus, or a welcome message"
              className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Schedule / meeting times
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    form.days.includes(day)
                      ? "bg-primary text-surface"
                      : "bg-canvas text-text-main hover:bg-border"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  Start time
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">
                  End time
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
                />
              </div>
            </div>
          </div>

          {/* Access type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main">
              Access type
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { value: "invite", label: "Invite only", desc: "Add students manually" },
                { value: "code", label: "Class code", desc: "Students join with a code" },
                { value: "open", label: "Open", desc: "Anyone with the link can join" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-lg border p-3 text-sm transition ${
                    form.accessType === opt.value
                      ? "border-primary bg-canvas"
                      : "border-border hover:border-text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="accessType"
                    value={opt.value}
                    checked={form.accessType === opt.value}
                    onChange={(e) => update("accessType", e.target.value)}
                    className="sr-only"
                  />
                  <p className="font-medium text-text-heading">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                setForm({
                  className: "",
                  section: "",
                  subject: "",
                  room: "",
                  description: "",
                  gradeLevel: "",
                  days: [],
                  startTime: "",
                  endTime: "",
                  accessType: "invite",
                  theme: THEME_COLORS[0].value,
                  coverImage: null,
                })
              }
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-surface transition hover:bg-primary-hover"
            >
              Create class
            </button>
          </div>

          {submitted && (
            <div className="rounded-lg bg-canvas px-4 py-3 text-sm text-success">
              Class created successfully.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
