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

export function ClassAccessTypeSection({ form, update }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-text-heading">
          Access & Enrollment
        </h2>
        <p className="mt-0.5 text-xs text-text-muted">
          Choose how students find and gain access to this class.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ACCESS_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = form.accessType === opt.value;

          return (
            <label
              key={opt.value}
              className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-border bg-surface hover:border-text-muted/50 hover:bg-canvas/40"
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
              <div className="flex items-start justify-between">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-primary text-surface"
                      : "bg-canvas text-text-muted border border-border"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
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

              <div className="mt-3">
                <p className="text-sm font-semibold text-text-heading">
                  {opt.label}
                </p>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">
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
