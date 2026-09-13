import { Globe, KeyRound, Lock } from "lucide-react";

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
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Access & Privacy
        </label>
        <p className="text-[12px] text-text-muted">
          Choose who can discover and join this space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ACCESS_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = form.accessType === opt.value;

          return (
            <label
              key={opt.value}
              className={`relative flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-all ${
                isSelected
                  ? "border-primary bg-primary/8 ring-1 ring-primary/40 shadow-2xs"
                  : "border-border bg-surface hover:border-text-muted/50 hover:bg-canvas/50"
              }`}
            >
              <input
                type="radio"
                name="accessType"
                value={opt.value}
                checked={isSelected}
                onChange={(e) => update("accessType", e.target.value)}
                className="sr-only"
              />
              <div
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors mt-0.5 ${
                  isSelected
                    ? "bg-primary text-surface"
                    : "bg-canvas text-text-muted border border-border"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-text-heading">
                    {opt.label}
                  </p>
                  <div
                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-border bg-surface"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-surface" />
                    )}
                  </div>
                </div>
                <p className="mt-0.5 text-[11px] text-text-muted leading-tight">
                  {opt.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
