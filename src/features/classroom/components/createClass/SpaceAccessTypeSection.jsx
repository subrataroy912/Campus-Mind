import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, KeyRound, Lock } from "lucide-react";

const ACCESS_OPTIONS = [
  {
    value: "invite",
    label: "Invite only",
    desc: "Only students added manually or invited by you can join.",
    icon: Lock,
  },
  {
    value: "code",
    label: "Class code",
    desc: "Students join by entering an enrollment code you share.",
    icon: KeyRound,
  },
  {
    value: "open",
    label: "Open / Public",
    desc: "Anyone with the link or browsing the explore page can join.",
    icon: Globe,
  },
];

export function SpaceAccessTypeSection({ form, update }) {
  const selected =
    ACCESS_OPTIONS.find((o) => o.value === form.accessType) ||
    ACCESS_OPTIONS[0];
  const SelectedIcon = selected.icon;

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    }
    function onEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="space-y-1 " ref={rootRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Access & Privacy
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors hover:border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <SelectedIcon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-text-main">
              {selected.label}
            </div>
            <div className="truncate text-[11px] text-text-muted">
              {selected.desc}
            </div>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-md"
          >
            {ACCESS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = form.accessType === opt.value;

              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      update("accessType", opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/8 text-primary"
                        : "text-text-main hover:bg-canvas/60"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        isSelected
                          ? "bg-primary text-surface"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="truncate text-[11px] text-text-muted">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[3] text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
