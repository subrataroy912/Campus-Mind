import { useState } from "react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassPostBox() {
  const [text, setText] = useState("");

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
      <div className="flex gap-3">
        <ClassroomAvatar name="You" />
        <textarea
          rows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share an announcement or ask a question…"
          className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
        />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-1">
          {[['image', 'Attach'], ['video', 'Video'], ['poll', 'Poll']].map(([icon, label]) => (
            <button key={label} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-muted hover:bg-canvas sm:text-sm">
              <ClassroomIcon name={icon} className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <button
          disabled={!text.trim()}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-surface transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
