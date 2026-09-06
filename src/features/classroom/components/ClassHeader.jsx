import { useState } from "react";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassHeader({ classroom }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopy = () => {
    if (!classroom?.code) return;
    navigator.clipboard?.writeText(classroom.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
      {/* Banner Section */}
      <div
        className={`relative h-28 sm:h-36 ${classroom?.theme || "bg-primary"}`}
      >
        {/* Settings Dropdown */}
        <div className="absolute right-3 top-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Class settings"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/20 text-surface transition hover:bg-surface/30 backdrop-blur-sm"
            >
              <ClassroomIcon name="settings" className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-10 w-52 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border">
                {[
                  "Edit class details",
                  "Change theme",
                  "Notification preferences",
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3.5 py-2 text-left text-sm text-text-main hover:bg-canvas transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:pt-0">
        {/* Logo & Title Group */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
          {/* Floating Logo */}
          <div className="-mt-12 h-20 w-20 z-20 shrink-0 overflow-hidden rounded-2xl border-4 border-surface bg-canvas shadow-sm sm:-mt-14 sm:h-24 sm:w-24">
            <img
              src={
                classroom?.logo ||
                "https://testingbot.com/free-online-tools/random-avatar/100"
              }
              alt={`${classroom?.title || "Class"} logo`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title and Subtitle */}
          <div className="mb-1 sm:mb-2">
            <h1 className="text-xl font-bold text-text-heading sm:text-2xl line-clamp-1">
              {classroom?.title || "Untitled Class"}
            </h1>
            <p className="mt-1 text-sm font-medium text-text-muted line-clamp-1">
              {classroom?.section || classroom?.subtitle}
              {(classroom?.section || classroom?.subtitle) &&
              (classroom?.teacher || classroom?.instructor)
                ? " · "
                : ""}
              {(classroom?.teacher || classroom?.instructor)?.name}
            </p>
          </div>
        </div>

        {/* Action Button (Invite Code) */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas px-4 py-2 text-sm font-semibold text-text-main transition hover:bg-border/50 sm:mb-2 sm:self-auto"
        >
          <ClassroomIcon
            name={copied ? "check" : "copy"}
            className={`h-4 w-4 ${copied ? "text-success" : "text-text-muted"}`}
          />
          {copied ? (
            <span className="text-success">Copied to clipboard</span>
          ) : (
            <span>
              Invite code:{" "}
              <span className="font-mono text-primary">{classroom?.code}</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
