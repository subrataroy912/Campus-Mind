import { useState } from "react";
import { QUICK_LINKS } from "../data/classPageData.js";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassQuickLinks({ teacher = false }) {
  const [links, setLinks] = useState(QUICK_LINKS);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "", href: "" });

  function addLink(event) {
    event.preventDefault();
    const label = form.label.trim();
    const href = form.href.trim();
    if (!label || !href) return;

    setLinks((items) => [...items, { id: crypto.randomUUID(), icon: "link", label, href }]);
    setForm({ label: "", href: "" });
    setAdding(false);
  }

  return (
    <section className="mt-4">
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">CLASS RESOURCES</p>
            <h2 className="text-2xl font-bold tracking-tight text-text-heading">Quick links</h2>
            <p className="mt-1 text-sm text-text-muted">Find the resources your class uses most often.</p>
          </div>
          {teacher && !adding && (
            <button onClick={() => setAdding(true)} className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-canvas">
              + Add link
            </button>
          )}
        </header>

        {adding && (
          <form onSubmit={addLink} className="mt-5 grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="grid gap-1.5 text-sm font-medium text-text-main">
              Link label
              <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Course syllabus" className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-focus/30" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-text-main">
              URL
              <input value={form.href} onChange={(event) => setForm({ ...form, href: event.target.value })} placeholder="https://…" type="url" className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-focus/30" />
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface">Cancel</button>
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary/90">Save link</button>
            </div>
          </form>
        )}

        {links.length ? (
          <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {links.map((link) => (
              <li key={link.id}>
                <a href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-main hover:bg-canvas">
                  <span className="rounded-lg bg-primary/10 p-2 text-primary"><ClassroomIcon name={link.icon} className="h-4 w-4" /></span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : <p className="mt-5 text-sm text-text-muted">No quick links yet.</p>}
      </div>
    </section>
  );
}
