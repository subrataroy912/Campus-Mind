import { ACTIVE_NOW, QUICK_LINKS, TODO_ITEMS } from "../data/classPageData.js";
import { ClassroomAvatar } from "./ClassroomAvatar.jsx";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassSidePanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 text-sm font-semibold text-text-heading">Upcoming (next 7 days)</h3>
        <ul className="space-y-2.5">
          {TODO_ITEMS.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <ClassroomIcon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <div className="min-w-0">
                <p className="truncate text-sm text-text-main">{item.title}</p>
                <p className="text-xs text-text-muted">{item.due}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-text-heading">
          <span className="h-2 w-2 rounded-full bg-success" />
          Active now
        </h3>
        <ul className="space-y-2.5">
          {ACTIVE_NOW.map((person) => (
            <li key={person.id} className="flex items-center gap-2.5">
              <div className="relative">
                <ClassroomAvatar name={person.name} size="h-7 w-7" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
              </div>
              <span className="text-sm text-text-main">{person.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border">
        <h3 className="mb-3 text-sm font-semibold text-text-heading">Quick links</h3>
        <ul className="space-y-1">
          {QUICK_LINKS.map((link) => (
            <li key={link.id}>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-text-main transition hover:bg-canvas">
                <ClassroomIcon name={link.icon} className="h-4 w-4 text-text-muted" />
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
