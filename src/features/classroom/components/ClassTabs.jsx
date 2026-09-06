import { CLASS_TABS } from "../data/classPageData.js";

export default function ClassTabs({ active, onChange }) {
  return (
    <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 shadow-sm ring-1 ring-border sm:gap-2">
      {CLASS_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${active === tab.id ? "bg-primary text-surface" : "text-text-main hover:bg-canvas"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
