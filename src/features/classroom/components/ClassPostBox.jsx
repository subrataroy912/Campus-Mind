import { useState } from "react";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassPostBox({ onSubmit }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText("");
  };
  return (
    <div className="rounded-xl bg-card p-3 border border-border/70 shadow-2xs">
      <div className="flex gap-2.5">
        <ClassroomAvatar name="You" size="h-7 w-7" />
        <textarea
          rows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share an announcement or update with this space…"
          className="w-full resize-none rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/50"
        />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2">
        <div className="flex flex-wrap gap-1">
          {[['image', 'Attach'], ['video', 'Video'], ['poll', 'Poll']].map(([icon, label]) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground cursor-pointer"
            >
              <ClassroomIcon name={icon} className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-2xs transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Post
        </button>
      </div>
    </div>
  );
}
