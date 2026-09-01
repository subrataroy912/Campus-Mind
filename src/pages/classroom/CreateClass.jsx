import { useState } from "react";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Art",
  "Music", "Physical Education", "Computer Science", "Foreign Language", "Other",
];

const GRADE_LEVELS = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "College / Adult",
];

const THEME_COLORS = [
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Rose", value: "bg-rose-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Violet", value: "bg-violet-500" },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Create a class
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Set up a new class for your students to join.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6 lg:p-8"
        >
          {/* Cover image / theme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                <span className="text-lg font-semibold text-white/90 sm:text-xl">
                  {form.className || "Your class name"}
                </span>
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow hover:bg-white">
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
                        ? "ring-2 ring-slate-900"
                        : "ring-1 ring-slate-200"
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Class name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.className}
                onChange={(e) => update("className", e.target.value)}
                placeholder="e.g. Algebra II"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  errors.className ? "border-rose-400" : "border-slate-300"
                }`}
              />
              {errors.className && (
                <p className="mt-1 text-xs text-rose-500">{errors.className}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Section
              </label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => update("section", e.target.value)}
                placeholder="e.g. Period 3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Subject + Grade level */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Subject <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  errors.subject ? "border-rose-400" : "border-slate-300"
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
                <p className="mt-1 text-xs text-rose-500">{errors.subject}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Grade level <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.gradeLevel}
                onChange={(e) => update("gradeLevel", e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                  errors.gradeLevel ? "border-rose-400" : "border-slate-300"
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
                <p className="mt-1 text-xs text-rose-500">{errors.gradeLevel}</p>
              )}
            </div>
          </div>

          {/* Room / Location */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Room / location
            </label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => update("room", e.target.value)}
              placeholder="e.g. Room 204 or https://zoom.us/j/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A brief overview of the course, syllabus, or a welcome message"
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Start time
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  End time
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Access type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-300 hover:border-slate-400"
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
                  <p className="font-medium text-slate-800">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Create class
            </button>
          </div>

          {submitted && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Class created successfully.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
